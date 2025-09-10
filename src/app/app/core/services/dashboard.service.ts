import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private base = environment.apiBase;

  constructor(private http: HttpClient) { }

  getDashboardData() {
    return this.http.get(`${this.base}/GetDashboardData`);
  }
}
