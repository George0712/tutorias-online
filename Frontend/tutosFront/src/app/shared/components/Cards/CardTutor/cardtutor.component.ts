import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-tutor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cardtutor.component.html',
  styleUrl: './cardtutor.component.css'
})
export class CardTutorComponent {
  constructor(private router: Router) {}

  toDetailsTutor() {
    this.router.navigate(['/user/student/details-tutor']);
  }
}
