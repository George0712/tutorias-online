import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from '../../../shared/components/review/review.component';
import { AuthService } from '../../../services/auth.service';
import { TutorPersonalService, TutorProfessionalService, TutorPersonal, TutorProfessional, TutorSkill, TutorEducation } from '../../../services/tutor.service';

@Component({
  selector: 'app-detailtutor',
  standalone: true,
  imports: [CommonModule, ReviewComponent],
  templateUrl: './detail-tutor.component.html',
  styleUrl: './detail-tutor.component.css'
})
export default class DetailtutorComponent implements OnInit {
  tutorPersonal: TutorPersonal | null = null;
  tutorProfessional: TutorProfessional | null = null;
  tutorSkills: TutorSkill[] = [];
  tutorEducation: TutorEducation[] = [];
  loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private tutorPersonalService: TutorPersonalService,
    private tutorProfessionalService: TutorProfessionalService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const tutorId = +params['id'];
      if (tutorId) {
        this.loadTutorData(tutorId);
      }
    });
  }

  private loadTutorData(tutorId: number) {
    this.loading = true;
    console.log('Cargando datos del tutor:', tutorId);
    
    // Cargar información personal
    this.tutorPersonalService.getTutorById(tutorId).subscribe(
      personalData => {
        console.log('Datos personales cargados:', personalData);
        this.tutorPersonal = personalData;
      }
    );

    // Cargar información profesional
    this.tutorProfessionalService.getTutorById(tutorId).subscribe(
      professionalData => {
        console.log('Datos profesionales cargados:', professionalData);
        this.tutorProfessional = professionalData;
      }
    );

    // Cargar habilidades
    this.tutorProfessionalService.getTutorSkills(tutorId).subscribe(
      skills => {
        console.log('Habilidades cargadas:', skills);
        this.tutorSkills = skills;
      }
    );

    // Cargar educación del tutor
    this.tutorProfessionalService.getTutorEducation(tutorId).subscribe(
      education => {
        console.log('Educación cargada:', education);
        this.tutorEducation = education;
        this.loading = false;
      },
      error => {
        console.error('Error al cargar educación:', error);
        this.loading = false;
      }
    );
  }

  navigateToLogin() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/user/profile']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  navigateToBooking() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/user/student/booking', this.tutorPersonal?.id]);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
