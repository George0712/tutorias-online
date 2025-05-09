import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-modal-skills',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-skills.component.html',
  styleUrl: './modal-skills.component.css'
})
export default class ModalSkillsComponent {
  skillsForm: FormGroup;
  isSubmitting = false;
  skillsList: any[] = [];

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalSkillsComponent>,
    private userService: UserService
  ) {
    this.skillsForm = this.fb.group({
      habilidad: ['', Validators.required],
      nivel: ['', Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

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
    this.userService.setSkillList(this.skillsList).subscribe({
      next: () => {
        toast.success('Habilidades guardadas exitosamente');
        this.close();
      },
      error: (error) => {
        console.error('Error al guardar las habilidades:', error);
        toast.error('Error al guardar las habilidades');
        this.isSubmitting = false;
      }
    });
  }

  onAdd(): void {
    if (this.skillsForm.valid) {
      const habilidadSeleccionada = this.habilidades.find(h => h.id == this.skillsForm.value.habilidad)?.name;
      const nivelSeleccionado = this.niveles.find(n => n.id == this.skillsForm.value.nivel)?.name;

      const nuevaHabilidad = {
        habilidad: habilidadSeleccionada,
        nivel: nivelSeleccionado
      };

      this.skillsList.push(nuevaHabilidad);
      this.skillsForm.reset({ habilidad: '', nivel: '' });
      toast.success('Habilidad añadida');
    } else {
      this.markAllAsTouched();
    }
  }

  removeSkill(skillToRemove: any): void {
    this.skillsList = this.skillsList.filter(skill => 
      skill.habilidad !== skillToRemove.habilidad || skill.nivel !== skillToRemove.nivel
    );
    toast.success('Habilidad eliminada');
  }

  private markAllAsTouched(): void {
    Object.values(this.skillsForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get f() {
    return this.skillsForm.controls;
  }
}
