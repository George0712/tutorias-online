import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formpersonaldata',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formpersonaldata.component.html',
  styleUrl: './formpersonaldata.component.css'
})
export default class FormpersonaldataComponent {
  profileTutorForm: FormGroup;
  profileImage: string | ArrayBuffer | null = 'https://via.placeholder.com/100';
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.profileTutorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      identification: ['', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]]
    });
  }

  // Manejo de cambio de imagen de perfil
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result || null;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Manejo del envío del formulario
  onSubmit(): void {
    if (this.profileTutorForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Simulación de envío a API
    console.log('Form data:', this.profileTutorForm.value);
    
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/register/student']);
    }, 1500);
  }

  // Marcar todos los campos como touched para mostrar errores
  private markAllAsTouched(): void {
    Object.values(this.profileTutorForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Helper para acceder fácil a los controles del formulario
  get f() {
    return this.profileTutorForm.controls;
  }
}
