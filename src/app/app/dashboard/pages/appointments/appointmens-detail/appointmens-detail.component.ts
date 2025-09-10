import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../../core/services/appointment.service';

@Component({
  selector: 'app-appointmens-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointmens-detail.component.html',
  styleUrl: './appointmens-detail.component.css'
})



export class AppointmensDetailComponent {
  @Input() appointment: any = null;
  @Output() close = new EventEmitter<boolean>(); 

  loading = false;

  constructor(private appointmentService: AppointmentService) { }

  closeModal(refresh = false) {
    this.close.emit(refresh);
  }

  markDone() {
    if (!this.appointment?.appointmentId) return;
    if (!confirm('Marcar como hecha?')) return;
    this.loading = true;
    this.appointmentService.markAppointmentDone(this.appointment.appointmentId).subscribe({
      next: () => {
        this.loading = false;
        this.closeModal(true);
      },
      error: (err: any) => {
        this.loading = false;
        console.error(err);
        alert('Error marcando como hecha');
      }
    });
  }

  delete() {
    if (!this.appointment?.appointmentId) return;
    if (!confirm('Eliminar cita?')) return;
    this.loading = true;
    this.appointmentService.deleteAppointmentByAppointment(this.appointment.appointmentId).subscribe({
      next: () => {
        this.loading = false;
        this.closeModal(true);
      },
      error: (err: any) => {
        this.loading = false;
        console.error(err);
        alert('Error eliminando cita');
      }
    });
  }
}
