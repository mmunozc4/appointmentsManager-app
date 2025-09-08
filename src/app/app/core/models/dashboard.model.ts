import { Appointment } from './appointment.model';

export interface DashboardData {
    totalPatients?: number;
    totalAppointments?: number;
    todaysTotalAppointments: number,
    todaysTotalDoneAppointments: number
    upcomingAppointments?: Appointment[];
}