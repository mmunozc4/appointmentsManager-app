import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private base = environment.apiBase;

  constructor(private http: HttpClient) { }

  getAllHospitals() {
    return this.http.get(`${this.base}/GetAllHospitals`);
  }

  getHospitalById(hospitalId: number) {
    const params = new HttpParams().set('hospitalId', String(hospitalId));
    return this.http.get(`${this.base}/GetHospitalById`, { params });
  }

  addNewHospital(payload: any) {
    return this.http.post(`${this.base}/AddNewHospital`, payload);
  }

  updateHospital(payload: any) {
    return this.http.put(`${this.base}/UpdateHospital`, payload);
  }

  deleteHospitalById(hospitalId: number) {
    const params = new HttpParams().set('hospitalId', String(hospitalId));
    return this.http.delete(`${this.base}/DeleteHospitalById`, { params });
  }
}
