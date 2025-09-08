import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HospitalService } from '../../core/services/hospital.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-hospital',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-hospital.component.html',
  styleUrls: ['./register-hospital.component.css'],
})
export class RegisterHospitalComponent {
  hospitalForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  step = 1;

  constructor(private fb: FormBuilder, private api: HospitalService) {
    this.hospitalForm = this.fb.group({
      hospitalId: [0],
      hospitalName: ['', Validators.required],
      hospitalAddress: ['', Validators.required],
      hospitalCity: ['', Validators.required],
      hospitalContactNo: ['', Validators.required],
      hospitalOwnerName: ['', Validators.required],
      hospitalOwnerContactNo: ['', Validators.required],
      hospitalEmailId: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  isStepValid(): boolean {
    if (this.step === 1) {
      return (
        this.hospitalForm.get('hospitalName')?.valid &&
        this.hospitalForm.get('hospitalAddress')?.valid &&
        this.hospitalForm.get('hospitalCity')?.valid
      )
        ? true
        : false;
    }
    if (this.step === 2) {
      return (
        this.hospitalForm.get('hospitalContactNo')?.valid &&
        this.hospitalForm.get('hospitalOwnerName')?.valid &&
        this.hospitalForm.get('hospitalOwnerContactNo')?.valid
      )
        ? true
        : false;
    }
    return true;
  }

  nextStep() {
    if (this.isStepValid() && this.step < 3) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  onSubmit() {
    if (this.hospitalForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.api.addNewHospital(this.hospitalForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Hospital registrado con éxito ✅';
        this.hospitalForm.reset({ hospitalId: 0 });
        this.step = 1;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error al registrar hospital ❌';
        console.error(err);
      },
    });
  }
}
