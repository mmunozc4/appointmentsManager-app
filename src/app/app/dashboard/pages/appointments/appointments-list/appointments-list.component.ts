import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppointmentService } from '../../../../core/services/appointment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PatientService } from '../../../../core/services/patient.service';

import { AppointmensDetailComponent } from '../appointmens-detail/appointmens-detail.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AppointmensDetailComponent, RouterLink],
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {
  hospitalId: number | null = null;
  appointments: any[] = [];
  filtered: any[] = [];

  q = '';
  filterState: 'all' | 'pending' | 'done' = 'all';
  dateFrom: string = '';
  dateTo: string = '';

  showDetail = false;
  selectedAppointment: any = null;

  loading = false;

  constructor(
    private appointmentService: AppointmentService,
    private auth: AuthService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    const u = this.auth.currentUser;
    this.hospitalId = u?.hospitalId ? Number(u.hospitalId) : null;
    if (this.hospitalId) this.load();
    else {
      this.auth.currentUser$.subscribe((user: any) => {
        if (user?.hospitalId) {
          this.hospitalId = Number(user.hospitalId);
          this.load();
        }
      });
    }
  }

  load(): void {
    if (!this.hospitalId) return;
    this.loading = true;
    this.appointmentService.getAllAppointmentsByHospitalid(this.hospitalId).subscribe({
      next: (res: any) => {
        const arr = Array.isArray(res) ? res : (res?.data ?? []);
        this.appointments = arr;
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando citas', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filtered = this.appointments.filter((a) => {
      const name = (a.name ?? a.patientName ?? '').toString().toLowerCase();
      const phone = (a.mobileNo ?? a.contactNo ?? '').toString().toLowerCase();
      if (this.q) {
        if (!name.includes(this.q.toLowerCase()) && !phone.includes(this.q.toLowerCase())) return false;
      }

      const done = this.isDone(a);
      if (this.filterState === 'pending' && done) return false;
      if (this.filterState === 'done' && !done) return false;

      if (this.dateFrom) {
        const from = new Date(this.dateFrom).setHours(0, 0, 0, 0);
        const apd = a.appointmentDate ? new Date(a.appointmentDate).setHours(0, 0, 0, 0) : null;
        if (apd == null || apd < from) return false;
      }
      if (this.dateTo) {
        const to = new Date(this.dateTo).setHours(23, 59, 59, 999);
        const apd = a.appointmentDate ? new Date(a.appointmentDate).getTime() : null;
        if (apd == null || apd > to) return false;
      }

      return true;
    });
  }

  clearFilters() {
    this.q = '';
    this.filterState = 'all';
    this.dateFrom = '';
    this.dateTo = '';
    this.applyFilters();
  }

  openDetail(appt: any) {
    this.selectedAppointment = appt;
    this.showDetail = true;
  }

  onDetailClosed(refresh = false) {
    this.showDetail = false;
    this.selectedAppointment = null;
    if (refresh) this.load();
  }

  markDone(appt: any) {
    if (!appt?.appointmentId) return;
    if (!confirm('Marcar esta cita como hecha?')) return;
    this.appointmentService.markAppointmentDone(appt.appointmentId).subscribe({
      next: () => { this.load(); },
      error: (err: any) => console.error(err)
    });
  }

  deleteAppointment(appt: any) {
    if (!appt?.appointmentId) return;
    if (!confirm('Eliminar esta cita?')) return;
    this.appointmentService.deleteAppointmentByAppointment(appt.appointmentId).subscribe({
      next: () => { this.load(); },
      error: (err: any) => console.error(err)
    });
  }

  private isDone(a: any): boolean {
    if (!a) return false;
    if (a.isCompleted === true || a.isDone === true || a.completed === true) return true;
    const status = (a.status ?? a.appointmentStatus ?? '').toString().toLowerCase();
    return ['done', 'completed', 'true', '1'].includes(status);
  }
}
