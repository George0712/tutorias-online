import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-formpersonaldata',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-personal-data.component.html',
  styleUrl: './form-personal-data.component.css',
})
export default class FormpersonaldataComponent {
  personalDataTutorForm: FormGroup;
  photo: string = '/default-avatar.jpg';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private Service: UserService
  ) {
    this.personalDataTutorForm = this.fb.group({
      first_name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      last_name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      id_number: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)],
      ],
      location: ['', Validators.required],
      birthdate: [
        '',
        [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],
      ],
      number_phone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)],
      ],
      photo: ['', Validators.required],
    });
  }

  // Manejo de cambio de imagen de perfil
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // Guardamos el archivo directamente en el formulario
      const file = input.files[0];
      this.personalDataTutorForm.get('photo')?.setValue(file);
  
      // Opcional: Mostrar la imagen de vista previa en el componente (en base64)
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photo = (e.target?.result as string) || '/default-avatar.jpg';
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.personalDataTutorForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    try {
      const formValues = this.personalDataTutorForm.value;

      const dataToSend = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        id_number: formValues.id_number,
        location: formValues.location,
        birthdate: formValues.birthdate,
        number_phone: formValues.number_phone,
        photo: this.personalDataTutorForm.get('photo')?.value || null,
      };

      console.log('Datos a enviar:', dataToSend);

      this.Service.SavePersonalData(dataToSend).subscribe({
        next: (res) => {
          console.log('Respuesta del servidor:', res); // Log the full response
          const role = res.role;
          if (!role) {
            console.error('El rol no está definido en la respuesta.');
            toast.error('Hubo un problema al determinar el rol.');
            return;
          }

          toast.success('Información guardada correctamente.');
          
          if(role === 'student'){
            this.router.navigate(['/user/student/home-student']);
          } else if (role === 'tutor') {
            this.router.navigate(['/user/tutor/form-aditional-data']);
          } else {
            console.error('Rol desconocido:', role);
            toast.error('Rol desconocido recibido.');
          }
        },
        error: (err) => {
          console.error('Error al guardar información:', err);
          toast.error('Hubo un problema al guardar la información.');
        },
      });
    } catch (error) {
      console.error('Error inesperado:', error);
      toast.error('Hubo un problema inesperado al guardar la información.');
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markAllAsTouched(): void {
    Object.values(this.personalDataTutorForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  // Helper para acceder fácil a los controles del formulario
  get f() {
    return this.personalDataTutorForm.controls;
  }
}
