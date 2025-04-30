import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modal-languaje',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-languaje.component.html',
  styleUrl: './modal-languaje.component.css'
})
export default class ModalLanguajeComponent {
  languageForm: FormGroup;
  isSubmitting = false;
  languagesList: any[] = []; // Para almacenar idiomas añadidos

  // Listas para los select (pueden venir de un servicio)
  idiomas = [
    { id: 1, name: 'Inglés' },
    { id: 2, name: 'Español' },
    { id: 3, name: 'Francés' },
    { id: 4, name: 'Alemán' },
    { id: 5, name: 'Portugués' }
  ];

  niveles = [
    { id: 1, name: 'Básico' },
    { id: 2, name: 'Intermedio' },
    { id: 3, name: 'Avanzado' },
    { id: 4, name: 'Nativo' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.languageForm = this.fb.group({
      idioma: ['', Validators.required],
      nivel: ['', Validators.required]
    });
  }

  close() {
    this.router.navigate(
      [{ outlets: { modal: null } }],
      { relativeTo: this.route.parent } // vuelve al contexto padre
    );
  }

  onSubmit(): void {
    console.log('Form data:', this.languageForm.value);
    if (this.languageForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
  }


  onAdd(): void {
    if (this.languageForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const newLanguage = {
      idioma: this.idiomas.find(i => i.id == this.languageForm.value.idioma)?.name,
      nivel: this.niveles.find(n => n.id == this.languageForm.value.nivel)?.name
    };

    this.languagesList.push(newLanguage);
    this.languageForm.reset();
    console.log('Idiomas actuales:', this.languagesList);
  }

  // Método para eliminar un idioma de la lista
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

