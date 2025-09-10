import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { PatientService } from '../../../../core/services/patient.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-patients-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patients-form.component.html',
  styleUrls: ['./patients-form.component.css']
})
export class PatientsFormComponent implements OnInit {
  @Input() prefill: any | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  patientForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private patientService: PatientService, private auth: AuthService) {
    this.patientForm = this.fb.group({
      patientId: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      city: [''],
      age: [0, [Validators.min(0), Validators.max(120)]],
      gender: [''],
      hospitalId: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    const u = this.auth.currentUser;
    const hid = u?.hospitalId ? Number(u.hospitalId) : null;
    if (hid) {
      this.patientForm.patchValue({ hospitalId: hid });
    }

    if (this.prefill) {
      const pid = Number(this.prefill.patientId ?? this.prefill.id ?? 0);
      this.patientForm.patchValue({
        patientId: pid,
        name: this.prefill.name ?? this.prefill.patientName ?? this.prefill.fullName ?? '',
        mobileNo: this.prefill.mobileNo ?? this.prefill.phone ?? this.prefill.contactNo ?? '',
        city: this.prefill.city ?? '',
        age: Number(this.prefill.age ?? 0),
        gender: this.prefill.gender ?? ''
      });
    }
  }

  submit(): void {
    this.submitted = true;
    if (this.patientForm.invalid) return;

    this.loading = true;
    const payload = {
      patientId: Number(this.patientForm.value.patientId),
      name: this.patientForm.value.name || '',
      mobileNo: this.patientForm.value.mobileNo || '',
      city: this.patientForm.value.city || '',
      age: Number(this.patientForm.value.age || 0),
      gender: this.patientForm.value.gender || '',
      hospitalId: Number(this.patientForm.value.hospitalId || 0)
    };

    const request$ = payload.patientId > 0
      ? this.patientService.updatePatient(payload)
      : this.patientService.addNewPatient(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error guardando paciente', err);
        this.loading = false;
        alert('Ocurrió un error al guardar el paciente.');
      }
    });
  }

  close(): void {
    this.cancel.emit();
  }

  get f() {
    return this.patientForm.controls;
  }
}
