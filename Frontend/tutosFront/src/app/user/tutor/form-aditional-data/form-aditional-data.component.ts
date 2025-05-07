import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-formaditionaldata',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './form-aditional-data.component.html',
  styleUrl: './form-aditional-data.component.css',
})
export default class FormAditionalDataComponent {
  profileAdicionalTutorForm: FormGroup;
  educationForm: FormGroup;
  languageForm: FormGroup;
  skillsForm: FormGroup;

  isSubmitting = false;

  educationList: any[] = [];
  languageList: any[] = [];
  skillsList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.profileAdicionalTutorForm = this.fb.group({
      aboutYou: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ],
      hourlyRate: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
          Validators.min(5),
        ],
      ],
      modality: ['', Validators.required],
    });
    this.educationForm = this.fb.group({
      country: ['', Validators.required],
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      specialty: ['', Validators.required],
      graduationYear: ['', Validators.required],
    });

    this.languageForm = this.fb.group({
      idioma: ['', Validators.required],
      nivel: ['', Validators.required],
    });

    this.skillsForm = this.fb.group({
      habilidad: ['', Validators.required],
      nivel: ['', Validators.required],
    });
  }

  // Manejo del envío del formulario
  onSubmit(): void {
    if (this.profileAdicionalTutorForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const allAdditionalData = {
      ...this.profileAdicionalTutorForm.value,
      education: this.educationList,
      language: this.languageList,
      skills: this.skillsList
    };

    this.userService
      .SaveAdditionalData(allAdditionalData)
      .subscribe({
        next: () => {
          console.log('Datos adicionales guardados correctamente');
          this.router.navigate(['/user/tutor/profile']);
        },
        error: (err) => {
          console.error('Error al guardar los datos adicionales:', err);
          this.isSubmitting = false;
        },
      });
  }

  // Marcar todos los campos como touched para mostrar errores
  private markAllAsTouched(): void {
    Object.values(this.profileAdicionalTutorForm.controls).forEach(
      (control) => {
        control.markAsTouched();
      }
    );
  }

  // Helper para acceder fácil a los controles del formulario
  get f() {
    return this.profileAdicionalTutorForm.controls;
  }

  get education() {
    return this.educationForm.controls;
  }

  get language() {
    return this.languageForm.controls;
  }

  get skills() {
    return this.skillsForm.controls;
  }
}
