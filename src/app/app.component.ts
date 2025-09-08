import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './app/dashboard/layout/header/header.component';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { AuthService } from './app/core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'appointmentManager';

  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.currentUser$.pipe(
      map(user => !!user)
    );
  }
}
