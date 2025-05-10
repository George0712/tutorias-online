import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { toast } from 'ngx-sonner';

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalEducationComponent>,
    private userService: UserService
  ) {
    this.educationForm = this.fb.group({
      country: ['', Validators.required],
      university: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      title: ['', Validators.required],
      specialization: ['', Validators.required],
      graduation_year: ['', [Validators.required]]
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.educationList.length === 0) {
      if (this.educationForm.valid) {
        this.onAdd();
      } else {
        this.markAllAsTouched();
        return;
      }
    }

    this.isSubmitting = true;

    // Enviar cada educación individualmente
    const savePromises = this.educationList.map(education => 
      this.userService.setEducationList(education).toPromise()
    );

    Promise.all(savePromises)
      .then(() => {
        toast.success('Educación guardada correctamente');
        this.dialogRef.close(this.educationList);
      })
      .catch(error => {
        console.error('Error al guardar la educación:', error);
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
        toast.error('Error al guardar la educación');
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  onAdd(): void {
    if (this.educationForm.valid) {
      // Verificar límite de educación
      if (this.educationList.length >= 3) {
        toast.error('Límite de educación agregada');
        return;
      }

      const nuevaEducacion = {
        country: this.educationForm.value.country,
        university: this.educationForm.value.university,
        title: this.educationForm.value.title,
        specialization: this.educationForm.value.specialtization,
        graduation_year: this.educationForm.value.graduation_year
      };

      // Verificar si ya existe la misma educación
      const existe = this.educationList.some(edu => 
        edu.university === nuevaEducacion.university && 
        edu.title === nuevaEducacion.title &&
        edu.specialization === nuevaEducacion.specialization &&
        edu.graduationYear === nuevaEducacion.graduation_year
      );

      if (existe) {
        toast.error('Esta educación ya ha sido agregada');
        return;
      }

      this.educationList.push(nuevaEducacion);
      this.educationForm.reset({ country: '', university: '', title: '', specialization: '', graduation_year: '' });
    } else {
      this.markAllAsTouched();
    }
  }

  removeEducation(educationToRemove: any): void {
    this.educationList = this.educationList.filter(education => 
      education.university !== educationToRemove.university || 
      education.title !== educationToRemove.title ||
      education.specialization !== educationToRemove.specialization ||
      education.graduation_year !== educationToRemove.graduation_year
    );
    toast.success('Educación eliminada');
  }

  private markAllAsTouched(): void {
    Object.values(this.educationForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get f() {
    return this.educationForm.controls;
  }

  getGraduationYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 25; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  }
}
