import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Tutor } from '../../../../services/tutor.service';

@Component({
  selector: 'app-card-tutor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cardtutor.component.html',
  styleUrl: './cardtutor.component.css'
})
export class CardTutorComponent {
  @Input() tutor!: Tutor;

  constructor(private router: Router) {}

  toDetailsTutor() {
    this.router.navigate(['/user/student/details-tutor', this.tutor.id]);
  }
}
