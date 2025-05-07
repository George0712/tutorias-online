import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-modal-education',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-education.component.html',
  styleUrl: './modal-education.component.css'
})
export default class ModalEducationComponent {
  educationForm: FormGroup;
  isSubmitting = false;
  educationList: any[] = [];


  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private userService: UserService) {
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
    if (this.educationList.length === 0) {
      if (this.educationForm.valid) {
        this.onAdd();
      } else {
        this.markAllAsTouched();
        return;
      }
      this.isSubmitting = true;
      console.log('Educacion a enviar:', this.educationList);
      this.userService.setEducationList(this.educationList);
      this.close();
    }
  
    this.isSubmitting = true;
  
    // Aquí deberías llamar a tu servicio o guardar el array completo
    console.log('Lista de educaciones a enviar:', this.educationList);
  
    this.userService.setEducationList(this.educationList);
    this.close();
  }

  // Método para añadir educación (puede ser expandido)
  onAdd(): void {
    if (this.educationForm.valid) {
      this.educationList.push(this.educationForm.value);// se hace copia para evitar mutaciones
      console.log('Educación añadida:');
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
  for (let i = currentYear - 10; i <= currentYear; i++) {
    years.push(i);
  }
  return years;
}
}
