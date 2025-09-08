import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../../core/services/patient.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PatientsDetailComponent } from '../patients-detail/patients-detail.component';
import { PatientsFormComponent } from '../patients-form/patients-form.component';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PatientsDetailComponent, PatientsFormComponent],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  patients: any[] = [];
  filtered: any[] = [];
  loading = false;

  q = '';
  filterCity = '';

  showDetail = false;
  showForm = false;
  selectedPatient: any | null = null;

  hospitalId: number | null = null;

  constructor(private patientService: PatientService, private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.currentUser;
    this.hospitalId = user?.hospitalId ? Number(user.hospitalId) : null;
    this.loadPatients();
  }

  loadPatients() {
    if (!this.hospitalId) return;

    this.loading = true;
    this.patientService.getAllPatientsByHospitalId(this.hospitalId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.patients = Array.isArray(res) ? res : res?.data ?? [];
        this.filtered = this.patients;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error cargando pacientes:', err);
      }
    });
  }

  applyFilters() {
    this.filtered = this.patients.filter(p =>
      (p.name ?? p.fullName ?? '').toLowerCase().includes(this.q.toLowerCase()) &&
      (p.city ?? '').toLowerCase().includes(this.filterCity.toLowerCase())
    );
  }

  clearFilters() {
    this.q = '';
    this.filterCity = '';
    this.filtered = this.patients;
  }

  openDetail(p: any) {
    this.selectedPatient = p;
    this.showDetail = true;
  }

  onDetailClosed() {
    this.showDetail = false;
    this.selectedPatient = null;
  }

  openForm(p?: any) {
    this.selectedPatient = p ?? null;
    this.showForm = true;
  }

  onFormSaved() {
    this.showForm = false;
    this.selectedPatient = null;
    this.loadPatients();
  }

  deletePatient(p: any) {
    if (!confirm('¿Eliminar paciente?')) return;
    this.patientService.deletePatientByPatienId(p.patientId ?? p.id).subscribe({
      next: () => this.loadPatients(),
      error: (err: any) => console.error('Error eliminando paciente:', err)
    });
  }
}
