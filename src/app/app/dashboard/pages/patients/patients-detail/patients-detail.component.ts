import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patients-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients-detail.component.html',
  styleUrl: './patients-detail.component.css'
})
export class PatientsDetailComponent {
  @Input() patient: any;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
