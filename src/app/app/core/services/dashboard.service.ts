import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private base = 'https://freeapi.miniprojectideas.com/api/Practo';

  constructor(private http: HttpClient) { }

  getDashboardData() {
    return this.http.get(`${this.base}/GetDashboardData`);
  }
}
