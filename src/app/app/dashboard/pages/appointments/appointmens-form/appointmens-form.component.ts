import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';

import { AppointmentService } from '../../../../core/services/appointment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PatientService } from '../../../../core/services/patient.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointmens-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './appointmens-form.component.html',
  styleUrl: './appointmens-form.component.css'
})
export class AppointmensFormComponent implements OnInit {
  appointmentForm: FormGroup;
  patientsList: any[] = [];
  filteredPatients: any[] = [];
  patientSearch = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private auth: AuthService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      mobileNo: ['', Validators.required],
      city: [''],
      age: [0],
      gender: [''],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      isFirstVisit: [true],
      naration: [''],
      hospitalId: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    const u = this.auth.currentUser;
    const hid = u?.hospitalId ? Number(u.hospitalId) : null;
    if (hid) this.appointmentForm.patchValue({ hospitalId: hid });

    if (hid) {
      this.patientService.getAllPatientsByHospitalId(hid).subscribe({
        next: (res: any) => {
          const arr = Array.isArray(res) ? res : (res?.data ?? []);
          this.patientsList = arr;
          this.filteredPatients = arr;
        },
        error: (err: any) => console.error(err),
      });
    }
  }

  filterPatients() {
    const term = this.patientSearch.toLowerCase();
    this.filteredPatients = this.patientsList.filter((p) =>
      (p.name ?? p.patientName ?? p.fullName ?? '')
        .toLowerCase()
        .includes(term)
    );
  }

  onPatientSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    const p = this.patientsList.find((pat) => pat.id == id);
    if (p) {
      this.prefillPatientToForm(p);
    }
  }

  /** 👇 método faltante */
  choosePatient(p: any) {
    this.prefillPatientToForm(p);
  }

  prefillPatientToForm(p: any) {
    this.appointmentForm.patchValue({
      name: p.name ?? p.patientName ?? p.fullName ?? p.userName,
      mobileNo: p.mobileNo ?? p.contactNo ?? p.phone,
      city: p.city ?? '',
      age: p.age ?? 0,
      gender: p.gender ?? ''
    });
  }

  submit() {
    if (this.appointmentForm.invalid) return;
    this.loading = true;
    const payload = this.appointmentForm.value;

    if (payload.appointmentDate && !payload.appointmentDate.includes('T')) {
      payload.appointmentDate = new Date(payload.appointmentDate).toISOString();
    }

    this.appointmentService.addNewAppointment(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/appointments']);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error creando cita', err);
        alert('Error creando cita');
      }
    });
  }
}
