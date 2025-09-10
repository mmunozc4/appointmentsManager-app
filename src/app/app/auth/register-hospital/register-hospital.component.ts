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
      hospitalName: ['', [Validators.required, Validators.minLength(3)]],
      hospitalAddress: ['', [Validators.required]],
      hospitalCity: ['', [Validators.required]],
      hospitalContactNo: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,15}$/) // solo números entre 7 y 15 dígitos
      ]],
      hospitalOwnerName: ['', [Validators.required, Validators.minLength(3)]],
      hospitalOwnerContactNo: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,15}$/)
      ]],
      hospitalEmailId: ['', [Validators.required, Validators.email]],
      userName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_]{3,20}$/) // letras, números, guion bajo
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
    });
  }

  isStepValid(): boolean {
    if (this.step === 1) {
      return this.hospitalForm.get('hospitalName')?.valid &&
        this.hospitalForm.get('hospitalAddress')?.valid &&
        this.hospitalForm.get('hospitalCity')?.valid || false;
    }
    if (this.step === 2) {
      return this.hospitalForm.get('hospitalContactNo')?.valid &&
        this.hospitalForm.get('hospitalOwnerName')?.valid &&
        this.hospitalForm.get('hospitalOwnerContactNo')?.valid || false;
    }
    return true;
  }

  nextStep() {
    if (this.isStepValid() && this.step < 3) {
      this.step++;
    } else {
      this.hospitalForm.markAllAsTouched();
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.hospitalForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.hospitalForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('email')) return 'Formato de email inválido';
    if (control.hasError('minlength')) return `Debe tener al menos ${control.getError('minlength').requiredLength} caracteres`;
    if (control.hasError('pattern')) {
      switch (controlName) {
        case 'hospitalContactNo':
        case 'hospitalOwnerContactNo':
          return 'Debe ser un número válido (7 a 15 dígitos)';
        case 'userName':
          return 'Solo letras, números o "_" (3-20 caracteres)';
      }
    }
    return 'Campo inválido';
  }

  onSubmit() {
    if (this.hospitalForm.invalid) {
      this.hospitalForm.markAllAsTouched();
      this.errorMessage = 'Por favor corrige los errores antes de enviar ❌';
      return;
    }

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
