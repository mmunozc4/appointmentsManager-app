import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private base = '/api/Practo';

  constructor(private http: HttpClient) { }


  getAllPatients() {
    return this.http.get(`${this.base}/GetAllPatients`);
  }

  getAllPatientsByHospitalId(hospitalId: number) {
    const params = new HttpParams().set('id', String(hospitalId));
    return this.http.get(`${this.base}/GetAllPatientsByHospitalId`, { params });
  }

  getPatientByPatientId(patientId: number) {
    const params = new HttpParams().set('patientId', String(patientId));
    return this.http.get(`${this.base}/GetPatientByPatientId`, { params });
  }

  addNewPatient(payload: any) {
    return this.http.post(`${this.base}/AddNewPatient`, payload);
  }

  updatePatient(payload: any) {
    return this.http.put(`${this.base}/UpdatePatient`, payload);
  }

  deletePatientByPatienId(patientId: number) {
    const params = new HttpParams().set('patientId', String(patientId));
    return this.http.delete(`${this.base}/DeletePatientByPatienId`, { params });
  }
}
