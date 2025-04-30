import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modal-education',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-education.component.html',
  styleUrl: './modal-education.component.css'
})
export default class ModalEducationComponent {
  educationForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.educationForm = this.fb.group({
      country: ['', Validators.required],
      university: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      degree: ['', Validators.required],
      specialty: ['', Validators.required],
      graduationYear: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]]
    });
  }

close() {
  this.router.navigate(
    [{ outlets: { modal: null } }],
    { relativeTo: this.route.parent } // vuelve al contexto padre
  );
}

  // Manejo del envío del formulario
  onSubmit(): void {
    if (this.educationForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Simulación de envío a API
    console.log('Form data:', this.educationForm.value);
    
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/auth/register/student']);
    }, 1500);
  }

  // Método para añadir educación (puede ser expandido)
  onAdd(): void {
    if (this.educationForm.valid) {
      // Lógica para añadir esta educación a una lista antes de enviar todo
      console.log('Education added:', this.educationForm.value);
      this.educationForm.reset();
    } else {
      this.markAllAsTouched();
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markAllAsTouched(): void {
    Object.values(this.educationForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Helper para acceder fácil a los controles del formulario
  get f() {
    return this.educationForm.controls;
  }
  // Genera años de graduación desde el actual -10 hasta el actual +5
  getGraduationYears(): number[] {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 10; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
}
}
