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
      degree: ['', Validators.required],
      specialty: ['', Validators.required],
      graduationYear: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]]
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
    this.userService.setEducationList(this.educationList).subscribe({
      next: () => {
        toast.success('Educación guardada exitosamente');
        this.close();
      },
      error: (error) => {
        console.error('Error al guardar la educación:', error);
        toast.error('Error al guardar la educación');
        this.isSubmitting = false;
      }
    });
  }

  onAdd(): void {
    if (this.educationForm.valid) {
      const nuevaEducacion = {
        country: this.educationForm.value.country,
        university: this.educationForm.value.university,
        degree: this.educationForm.value.degree,
        specialty: this.educationForm.value.specialty,
        graduationYear: this.educationForm.value.graduationYear
      };

      this.educationList.push(nuevaEducacion);
      this.educationForm.reset({ country: '', university: '', degree: '', specialty: '', graduationYear: '' });
      toast.success('Educación añadida');
    } else {
      this.markAllAsTouched();
    }
  }

  removeEducation(educationToRemove: any): void {
    this.educationList = this.educationList.filter(education => 
      education.university !== educationToRemove.university || 
      education.degree !== educationToRemove.degree ||
      education.specialty !== educationToRemove.specialty ||
      education.graduationYear !== educationToRemove.graduationYear
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
