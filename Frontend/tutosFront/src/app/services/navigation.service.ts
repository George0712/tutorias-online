import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateToTutorDetails() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/user/student/details-tutor']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
} 