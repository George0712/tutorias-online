import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from '../../../shared/components/review/review.component';

@Component({
  selector: 'app-detailtutor',
  standalone: true,
  imports: [CommonModule, ReviewComponent],
  templateUrl: './detail-tutor.component.html',
  styleUrl: './detail-tutor.component.css'
})
export default class DetailtutorComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
