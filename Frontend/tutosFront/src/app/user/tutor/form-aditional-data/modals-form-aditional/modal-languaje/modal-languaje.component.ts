import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../services/user.service';

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

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private userService: UserService) {
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
    if (this.languagesList.length === 0) {
      if (this.languageForm.valid) {
        this.onAdd();
      } else {
        this.markAllAsTouched();
        return;
      }
    }

    this.isSubmitting = true;
    console.log('Idiomas a enviar:', this.languagesList);
    this.userService.setLanguageList(this.languagesList);
    this.close();
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
      this.languageForm.reset();
      console.log('Idioma añadido:', nuevoIdioma);
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

