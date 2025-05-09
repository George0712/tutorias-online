import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-profile-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css',
})
export default class ProfileUserComponent implements OnInit {
  profileForm: FormGroup;
  profileAdicionalForm: FormGroup;
  photo: string = '/default-avatar.jpg';
  userPersonalData: any = {};
  role: string = '';

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private Service: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      id_number: [ '', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]],
      location: ['', Validators.required],
      birthdate: ['', [Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      number_phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      photo: [''],
    });

    this.profileAdicionalForm = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getUserPersonalData();
      this.role = this.authService.getRole() || '';
    } else {
      this.route.navigate(['/visitor']);
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // Guardamos el archivo directamente en el formulario
      const file = input.files[0];
      this.profileForm.get('photo')?.setValue(file);

      // Opcional: Mostrar la imagen de vista previa en el componente (en base64)
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Vista previa base64:', this.photo);
        this.photo = (e.target?.result as string) || '/default-avatar.jpg';
        this.Service.guardarFoto(file);
      };
      reader.readAsDataURL(file);
    }
  }

  getUserPersonalData(): void {
    this.Service.getUserPersonalData().subscribe(
      (data) => {
        this.userPersonalData = data;
        console.log('Datos personales:', data);
        this.photo = data.profile_picture || '/default-avatar.jpg';
      },
      (error) => {
        console.error('Error al obtener los datos personales:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    try {
      const formValues = this.profileForm.value;

      console.log('este es el form de personal data');
      const dataToSend = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        id_number: formValues.id_number,
        location: formValues.location,
        birthdate: formValues.birthdate,
        number_phone: formValues.number_phone,
        photo: this.profileForm.get('photo')?.value || null,
      };

      console.log('Datos a enviar:', dataToSend);

      this.Service.SavePersonalData(dataToSend).subscribe({
        next: () => {
          toast.success('Información guardada correctamente.');
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

  onSubmitAdicional(): void {
    if (this.profileAdicionalForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    try {
      const formValues = this.profileAdicionalForm.value;
      console.log('este es el form de aditional data');
    } catch (error) {
      console.error('Error inesperado:', error);
      toast.error('Hubo un problema inesperado al guardar la información.');
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markAllAsTouched(): void {
    if (this.profileForm) {
      Object.values(this.profileForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    } else if (this.profileAdicionalForm) {
      Object.values(this.profileAdicionalForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }

  // Helper para acceder fácil a los controles del formulario
  get f() {
    return this.profileForm.controls;
  }
}
