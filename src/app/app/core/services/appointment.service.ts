import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private base = '/api/Practo';

  constructor(private http: HttpClient) { }

  getAllAppointments() {
    return this.http.get(`${this.base}/GetAllAppointments`);
  }

  getAllAppointmentsByHospitalid(hospitalId: number) {
    const params = new HttpParams().set('id', String(hospitalId));
    return this.http.get(`${this.base}/GetAllAppointmentsByHospitalid`, { params });
  }

  getTodaysAppointments() {
    return this.http.get(`${this.base}/GetTodaysAppointments`);
  }

  getAppointmentByAppointmentId(appointmentId: number) {
    const params = new HttpParams().set('appointmentId', String(appointmentId));
    return this.http.get(`${this.base}/GetAppointmentByAppointmentId`, { params });
  }

  addNewAppointment(payload: any) {
    return this.http.post(`${this.base}/AddNewAppointment`, payload);
  }

  markAppointmentDone(appointmentId: number) {
    const params = new HttpParams().set('appointmentId', String(appointmentId));
    return this.http.get(`${this.base}/MarkAppointmentDone`, { params });
  }

  deleteAppointmentByAppointment(appointmentId: number) {
    const params = new HttpParams().set('appointmentId', String(appointmentId));
    return this.http.delete(`${this.base}/DeleteAppointmentByAppointment`, { params });
  }

}
