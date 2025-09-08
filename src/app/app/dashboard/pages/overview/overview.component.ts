import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { PatientService } from '../../../core/services/patient.service';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {
  totalPatients = 0;
  totalAppointments = 0;
  todaysAppointments = 0;
  pendingAppointments = 0;

  upcomingAppointments: Array<{ patientName: string; appointmentTime: string; isCompleted: boolean; raw?: any }> = [];
  recentPatients: Array<{ patientName: string; contactNo: string; raw?: any }> = [];

  hospitalId!: number | null;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    const current = this.authService.currentUser;
    if (current && current.hospitalId) {
      this.hospitalId = Number(current.hospitalId);
      this.loadOverviewData();
    } else {
      this.authService.currentUser$
        .pipe(takeUntil(this.destroy$))
        .subscribe((user: any) => {
          if (user && user.hospitalId) {
            this.hospitalId = Number(user.hospitalId);
            this.loadOverviewData();
          } else {
            this.hospitalId = null;
          }
        });
    }
  }

  private loadOverviewData(): void {
    if (!this.hospitalId) return;

    this.isLoading = true;

    forkJoin({
      patients: this.patientService.getAllPatientsByHospitalId(this.hospitalId),
      appointments: this.appointmentService.getAllAppointmentsByHospitalid(this.hospitalId),
      todays: this.appointmentService.getTodaysAppointments()
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: ({ patients, appointments, todays }: any) => {
          const patientsArr: any[] = Array.isArray(patients) ? patients : (patients?.data ?? []);
          this.totalPatients = patientsArr.length;

          const sortedPatients = this.sortByDateFieldFallback(patientsArr, [
            'createdAt',
            'createdDate',
            'registrationDate',
            'registeredOn'
          ]);
          this.recentPatients = sortedPatients
            .slice(-5)
            .reverse()
            .map((p) => ({
              patientName: this.getPatientName(p),
              contactNo: this.getPatientContact(p),
              raw: p
            }));

          const apptsArr: any[] = Array.isArray(appointments) ? appointments : (appointments?.data ?? []);
          this.totalAppointments = apptsArr.length;
          const doneCount = apptsArr.filter((a) => this.isAppointmentDone(a)).length;
          this.pendingAppointments = Math.max(0, this.totalAppointments - doneCount);

          const todaysArr: any[] = Array.isArray(todays) ? todays : (todays?.data ?? []);
          const todaysFiltered = todaysArr.filter((a) => Number(a.hospitalId) === Number(this.hospitalId));
          this.todaysAppointments = todaysFiltered.length;

          this.upcomingAppointments = todaysFiltered
            .map((a) => ({
              patientName: this.getAppointmentPatientName(a),
              appointmentTime: this.getAppointmentTimeDisplay(a),
              isCompleted: this.isAppointmentDone(a),
              raw: a
            }))
            .sort((x, y) => this.compareAppointmentTimes(x.raw, y.raw))
            .slice(0, 5);
        },
        error: (err: any) => {
          console.error('Error cargando datos de overview', err);
          alert('⚠️ Ocurrió un error al cargar la información del panel. Intenta de nuevo más tarde.');
        }
      });
  }

  private getPatientName(p: any): string {
    return (p?.name ??
      p?.patientName ??
      p?.fullName ??
      ((p?.firstName && p?.lastName) ? `${p.firstName} ${p.lastName}` : null) ??
      p?.userName ??
      'Sin nombre');
  }

  private getPatientContact(p: any): string {
    return p?.mobileNo ?? p?.contactNo ?? p?.phone ?? p?.telephone ?? '—';
  }

  private getAppointmentPatientName(a: any): string {
    return a?.name ?? a?.patientName ?? a?.patient?.name ?? 'Sin nombre';
  }

  private getAppointmentTimeDisplay(a: any): string {
    if (a?.appointmentTime) return a.appointmentTime;
    if (a?.appointmentDate) {
      const d = new Date(a.appointmentDate);
      if (!isNaN(d.getTime())) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '—';
  }

  private isAppointmentDone(a: any): boolean {
    if (a == null) return false;
    if (a.isCompleted === true || a.isDone === true || a.completed === true) return true;
    const status = (a.status ?? a.appointmentStatus ?? '').toString().toLowerCase();
    return ['done', 'completed', 'true', '1'].includes(status);
  }

  private compareAppointmentTimes(a: any, b: any): number {
    return this.getComparableTimestamp(a) - this.getComparableTimestamp(b);
  }

  private getComparableTimestamp(a: any): number {
    if (!a) return 0;
    if (a.appointmentDate) {
      const d = new Date(a.appointmentDate);
      if (!isNaN(d.getTime())) return d.getTime();
    }
    if (a.appointmentTime) {
      const today = new Date();
      const parts = a.appointmentTime.match(/(\d{1,2}):(\d{2})/);
      if (parts) {
        const hh = Number(parts[1]);
        const mm = Number(parts[2]);
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm).getTime();
      }
    }
    return 0;
  }

  private sortByDateFieldFallback(arr: any[], dateFields: string[]): any[] {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    const foundField = dateFields.find((f) => arr.some((item) => item && item[f]));
    if (!foundField) return arr;
    return [...arr].sort((a, b) => {
      const da = new Date(a[foundField]).getTime() || 0;
      const db = new Date(b[foundField]).getTime() || 0;
      return da - db;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
