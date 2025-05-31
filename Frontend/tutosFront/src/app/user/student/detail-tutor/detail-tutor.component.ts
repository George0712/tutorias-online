import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from '../../../shared/components/review/review.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-detailtutor',
  standalone: true,
  imports: [CommonModule, ReviewComponent],
  templateUrl: './detail-tutor.component.html',
  styleUrl: './detail-tutor.component.css'
})
export default class DetailtutorComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateToLogin() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/user/profile']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
