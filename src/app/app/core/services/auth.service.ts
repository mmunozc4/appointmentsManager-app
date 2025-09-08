import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = 'https://freeapi.miniprojectideas.com/api/Practo';

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private getUserFromStorage() {
    if (!this.isBrowser()) return null;
    const user = localStorage.getItem('userLogin');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: { userName: string; password: string }) {
    return this.http.post(`${this.base}/Login`, credentials).pipe(
      tap((res: any) => {
        if (res?.data?.hospitalId && this.isBrowser()) {
          localStorage.setItem('userLogin', JSON.stringify(res.data));
          this.currentUserSubject.next(res.data); 
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
