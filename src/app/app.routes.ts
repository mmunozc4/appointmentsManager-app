import { Routes } from '@angular/router';

import { LoginComponent } from './app/auth/login/login.component';
import { RegisterHospitalComponent } from './app/auth/register-hospital/register-hospital.component';

import { OverviewComponent } from './app/dashboard/pages/overview/overview.component';

import { AppointmentsListComponent } from './app/dashboard/pages/appointments/appointments-list/appointments-list.component';
import { AppointmensFormComponent } from './app/dashboard/pages/appointments/appointmens-form/appointmens-form.component';
import { AppointmensDetailComponent } from './app/dashboard/pages/appointments/appointmens-detail/appointmens-detail.component';

import { PatientsListComponent } from './app/dashboard/pages/patients/patients-list/patients-list.component';
import { PatientsDetailComponent } from './app/dashboard/pages/patients/patients-detail/patients-detail.component';

import { HospitalsListComponent } from './app/admin/hospitals/hospitals-list/hospitals-list.component';
import { HospitalsFormComponent } from './app/admin/hospitals/hospitals-form/hospitals-form.component';

import { authGuard } from './app/core/guards/auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register-hospital', component: RegisterHospitalComponent },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      { path: '', component: OverviewComponent },
      {
        path: 'appointments',
        children: [
          { path: '', component: AppointmentsListComponent },
          { path: 'new', component: AppointmensFormComponent },
        ],
      },
      {
        path: 'patients',
        children: [
          { path: '', component: PatientsListComponent },
          { path: ':id', component: PatientsDetailComponent },
        ],
      },
    ],
  },

/*   {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      { path: 'hospitals', component: HospitalsListComponent },
      { path: 'hospitals/new', component: HospitalsFormComponent },
      { path: 'hospitals/:id', component: HospitalsFormComponent }, 
    ],
  }, */

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];


