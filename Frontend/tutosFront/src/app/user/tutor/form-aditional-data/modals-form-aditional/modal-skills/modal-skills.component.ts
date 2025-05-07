import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-modal-skills',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-skills.component.html',
  styleUrl: './modal-skills.component.css'
})
export default class ModalSkillsComponent {
  skillsForm: FormGroup;
  isSubmitting = false;
  skillsList: any[] = []; // Para almacenar habilidades añadidas

  // Listas para los select (pueden venir de un servicio)
  habilidades = [
    { id: 1, name: 'Matemáticas' },
    { id: 2, name: 'Programación' },
    { id: 3, name: 'Idiomas' },
    { id: 4, name: 'Ciencias' }
  ];

  niveles = [
    { id: 1, name: 'Básico' },
    { id: 2, name: 'Intermedio' },
    { id: 3, name: 'Avanzado' },
    { id: 4, name: 'Experto' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private userService: UserService) {
    this.skillsForm = this.fb.group({
      habilidad: ['', Validators.required],
      nivel: ['', Validators.required]
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
    if (this.skillsList.length === 0) {
      if (this.skillsForm.valid) {
        this.onAdd();
      } else {
        this.markAllAsTouched();
        return;
      }
    }

    this.isSubmitting = true;
    console.log('Habilidades a enviar:', this.skillsList);
    this.userService.setSkillList(this.skillsList);
    this.close();
  }

  // Método para añadir habilidades a la lista
  onAdd(): void {
    if (this.skillsForm.valid) {
      const habilidadSeleccionada = this.habilidades.find(h => h.id == this.skillsForm.value.habilidad)?.name;
      const nivelSeleccionado = this.niveles.find(n => n.id == this.skillsForm.value.nivel)?.name;

      const nuevaHabilidad = {
        habilidad: habilidadSeleccionada,
        nivel: nivelSeleccionado
      };

      this.skillsList.push(nuevaHabilidad);
      this.skillsForm.reset();
      console.log('Habilidad añadida:', nuevaHabilidad);
    } else {
      this.markAllAsTouched();
    };
  }

  // Marcar todos los campos como touched para mostrar errores
  private markAllAsTouched(): void {
    Object.values(this.skillsForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Helper para acceder fácil a los controles del formulario
  get f() {
    return this.skillsForm.controls;
  }
  // Método para eliminar una habilidad de la lista
  removeSkill(skillToRemove: any): void {
  this.skillsList = this.skillsList.filter(skill => 
    skill.habilidad !== skillToRemove.habilidad || skill.nivel !== skillToRemove.nivel
  );
}
}
