import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<any>;
  currentRoute: string = '';
  isDashboard: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$; 
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      this.isDashboard = this.currentRoute.startsWith('/dashboard');
      this.isAdmin = this.currentRoute.startsWith('/admin');
    });
  }

  logout() {
    this.authService.logout();
  }
}
