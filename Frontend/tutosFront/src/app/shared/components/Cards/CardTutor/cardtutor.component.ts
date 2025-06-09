import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TutorPersonal, TutorProfessional, TutorSkill, TutorProfessionalService } from '../../../../services/tutor.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-card-tutor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cardtutor.component.html',
  styleUrl: './cardtutor.component.css'
})
export class CardTutorComponent implements OnInit {
  @Input() tutorPersonal!: TutorPersonal;
  @Input() tutorProfessional!: TutorProfessional;
  showLoginModal = false;
  tutorSkills: TutorSkill[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private tutorProfessionalService: TutorProfessionalService
  ) {}

  ngOnInit() {
    if (this.tutorPersonal?.id) {
      this.loadTutorSkills();
    }
  }

  private loadTutorSkills() {
    this.tutorProfessionalService.getTutorSkills(this.tutorPersonal.id).subscribe(
      skills => {
        console.log('Skills cargadas:', skills);
        this.tutorSkills = skills;
      },
      error => {
        console.error('Error al cargar skills:', error);
      }
    );
  }

  toDetailsTutor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/user/student/details-tutor', this.tutorPersonal.id]);
    } else {
      this.showLoginModal = true;
    }
  }

  closeModal() {
    this.showLoginModal = false;
  }

  goToLogin() {
    this.closeModal();
    this.router.navigate(['/auth/login']);
  }
}
