import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = environment.apiBase;

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private getUserFromStorage() {
    if (!this.isBrowser()) return null;
    const user = localStorage.getItem('userLogin');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: { userName: string; password: string }) {
    console.log('🔑 Intentando login con:', credentials);
    console.log('🌐 Endpoint:', `${this.base}/Login`);

    return this.http.post(`${this.base}/Login`, credentials).pipe(
      tap({
        next: (res: any) => {
          console.log('✅ Respuesta login:', res);
          if (res?.data?.hospitalId && this.isBrowser()) {
            localStorage.setItem('userLogin', JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
        },
        error: (err) => {
          console.error('❌ Error en login:', err);
        }
      })
    );
  }


  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('userLogin');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
