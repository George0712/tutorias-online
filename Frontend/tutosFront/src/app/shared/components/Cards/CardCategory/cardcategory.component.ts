import { Component } from '@angular/core';

@Component({
  selector: 'app-cardcategory',
  imports: [],
  templateUrl: './cardcategory.component.html',
  styleUrl: './cardcategory.component.css'
})
export class CardcategoryComponent {
  /*tutorPersonal: TutorPersonal | null = null;
  tutorProfessional: TutorProfessional | null = null;
  tutorSkills: TutorSkill[] = [];
  tutorEducation: TutorEducation[] = [];
  loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private tutorPersonalService: TutorPersonalService,
    private tutorProfessionalService: TutorProfessionalService,
    private userService: UserService
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
    
    // Cargar información personal
    this.tutorPersonalService.getTutorById(tutorId).subscribe(
      personalData => {
        this.tutorPersonal = personalData;
      }
    );

    // Cargar información profesional
    this.tutorProfessionalService.getTutorById(tutorId).subscribe(
      professionalData => {
        this.tutorProfessional = professionalData;
      }
    );

    // Cargar habilidades
    this.userService.getUserSkillsById(tutorId).subscribe(
      skills => {
        this.tutorSkills = skills;
      }
    );

    // Cargar educación
    this.userService.getUserEducation().subscribe(
      education => {
        this.tutorEducation = education;
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
  }*/
}
