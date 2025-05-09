import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-modal-languaje',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-languaje.component.html',
  styleUrl: './modal-languaje.component.css'
})
export default class ModalLanguajeComponent {
  languageForm: FormGroup;
  isSubmitting = false;
  languagesList: any[] = [];

  idiomas = [
    { id: 1, name: 'Español' },
    { id: 2, name: 'Inglés' },
    { id: 3, name: 'Francés' },
    { id: 4, name: 'Alemán' }
  ];

  niveles = [
    { id: 1, name: 'Básico' },
    { id: 2, name: 'Intermedio' },
    { id: 3, name: 'Avanzado' },
    { id: 4, name: 'Nativo' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalLanguajeComponent>,
    private userService: UserService
  ) {
    this.languageForm = this.fb.group({
      idioma: ['', Validators.required],
      nivel: ['', Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.languagesList.length === 0) {
      if (this.languageForm.valid) {
        this.onAdd();
      } else {
        this.markAllAsTouched();
        return;
      }
    }

    this.isSubmitting = true;
    this.userService.setLanguageList(this.languagesList).subscribe({
      next: () => {
        toast.success('Idiomas guardados correctamente');
        this.dialogRef.close(this.languagesList);
      },
      error: (error) => {
        console.error('Error al guardar idiomas:', error);
        toast.error('Error al guardar los idiomas');
        this.isSubmitting = false;
      }
    });
  }

  onAdd(): void {
    if (this.languageForm.valid) {
      const idiomaSeleccionado = this.idiomas.find(i => i.id == this.languageForm.value.idioma)?.name;
      const nivelSeleccionado = this.niveles.find(n => n.id == this.languageForm.value.nivel)?.name;

      const nuevoIdioma = {
        idioma: idiomaSeleccionado,
        nivel: nivelSeleccionado
      };

      this.languagesList.push(nuevoIdioma);
      this.languageForm.reset({ idioma: '', nivel: '' });
    } else {
      this.markAllAsTouched();
    }
  }

  removeLanguage(languageToRemove: any): void {
    this.languagesList = this.languagesList.filter(lang =>
      lang.idioma !== languageToRemove.idioma || lang.nivel !== languageToRemove.nivel
    );
  }

  private markAllAsTouched(): void {
    Object.values(this.languageForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get f() {
    return this.languageForm.controls;
  }
}

