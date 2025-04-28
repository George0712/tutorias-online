import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formaditionaldata',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formaditionaldata.component.html',
  styleUrl: './formaditionaldata.component.css'
})
export default class FormaditionaldataComponent {
  profileAdicionalTutorForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.profileAdicionalTutorForm = this.fb.group({
      aboutYou: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      hourlyRate: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(5)]],
      // Los botones de agregar idioma, educación y habilidades manejarán su propia lógica
    });
  }

  // Manejo del envío del formulario
  onSubmit(): void {
    if (this.profileAdicionalTutorForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Simulación de envío a API
    console.log('Form data:', this.profileAdicionalTutorForm.value);
    
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/login']);
    }, 1500);
  }

  // Marcar todos los campos como touched para mostrar errores
  private markAllAsTouched(): void {
    Object.values(this.profileAdicionalTutorForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Helper para acceder fácil a los controles del formulario
  get f() {
    return this.profileAdicionalTutorForm.controls;
  }
}
