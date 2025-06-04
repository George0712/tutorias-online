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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import ModalLanguajeComponent from '../tutor/form-aditional-data/modal-languaje/modal-languaje.component';
import ModalEducationComponent from '../tutor/form-aditional-data/modal-education/modal-education.component';
import ModalSkillsComponent from '../tutor/form-aditional-data/modal-skills/modal-skills.component';

@Component({
  selector: 'app-profile-user',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css',
})
export default class ProfileUserComponent implements OnInit {
  profileForm: FormGroup;
  profileAdicionalForm: FormGroup;
  photo: string = '/default-avatar.jpg';
  userPersonalData: any = {};
  userAditionalData: any = {};
  role: string = '';
  languagesList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private Service: UserService,
    private authService: AuthService,
    private dialog: MatDialog
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

    this.profileAdicionalForm = this.fb.group({
      about_me: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      fee_per_hour: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      modality: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getUserPersonalData();
      this.getUserAditionalData();
      this.role = this.authService.getRole() || '';
    } else {
      this.route.navigate(['/visitor']);
    }
    console.log('userPersonalData', this.userPersonalData);
    console.log('userAditionalData', this.userAditionalData);
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.profileForm.get('photo')?.setValue(file);

      // Mostrar vista previa temporal
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photo = (e.target?.result as string) || '/default-avatar.jpg';
      };
      reader.readAsDataURL(file);
      
      // Guardar la foto en el backend
      this.Service.guardarFoto(file).subscribe({
        next: (response: { photo: string }) => {
          console.log('Foto guardada exitosamente:', response);
          // Actualizar la URL de la imagen con la respuesta del servidor
          if (response.photo) {
            this.photo = this.Service.getImageUrl(response.photo);
          }
        },
        error: (error: any) => {
          console.error('Error al guardar la foto:', error);
          toast.error('Error al guardar la foto');
        }
      });
    }
  }

  getUserPersonalData(): void {
    this.Service.getUserPersonalData().subscribe({
      next: (data) => {
        this.userPersonalData = data;
        this.photo = this.Service.getImageUrl(data.photo);
        this.profileForm.patchValue(this.userPersonalData);
        console.log('URL de la imagen:', this.photo);
      },
      error: (error) => {
        console.error('Error al obtener los datos personales:', error);
        toast.error('Error al cargar los datos del perfil');
      }
    });
  }

  getUserAditionalData(): void {
    this.Service.getUserAditionalData().subscribe({
      next: (data) => {
        this.userAditionalData = data;
        this.profileAdicionalForm.patchValue({
          about_me: this.userAditionalData.about_me,
          fee_per_hour: this.userAditionalData.fee_per_hour,
          modality: this.userAditionalData.modality
        });
        console.log('Datos adicionales:', this.userAditionalData);
      },
      error: (error) => {
        console.error('Error al obtener los datos adicionales:', error);
        toast.error('Error al cargar los datos del perfil');
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    try {
      const formValues = this.profileForm.value;

      const dataToSend = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        id_number: formValues.id_number,
        location: formValues.location,
        birthdate: formValues.birthdate,
        number_phone: formValues.number_phone,
        photo: this.profileForm.get('photo')?.value || null,
      };

      this.Service.SavePersonalData(dataToSend).subscribe({
        next: (res) => {
          if (res.photo) {
            this.photo = this.Service.getImageUrl(res.photo);
            this.userPersonalData.photo = res.photo;
          }
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
    if (!this.authService.isAuthenticated()) {
      console.error('Usuario no autenticado');
      toast.error('Debes iniciar sesión para realizar esta acción');
      this.route.navigate(['/auth/login']);
      return;
    }

    if (this.profileAdicionalForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    try {
      const formValues = this.profileAdicionalForm.value;

      const dataToSend = {
        about_me: formValues.about_me,
        fee_per_hour: formValues.fee_per_hour,
        modality: formValues.modality,
      };

      this.Service.SaveAdditionalData(dataToSend).subscribe({
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

  openModal(type: 'languaje' | 'education' | 'skills'): void {
    switch(type) {
      case 'languaje':
        const dialogRef = this.dialog.open(ModalLanguajeComponent, {
          width: '500px',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.languagesList = result;
          }
        });
        break;
      case 'education':
        this.dialog.open(ModalEducationComponent, {
          width: '500px',
          disableClose: true
        });
        break;
      case 'skills':
        this.dialog.open(ModalSkillsComponent, {
          width: '500px',
          disableClose: true
        });
        break;
    }
  }

  removeLanguage(language: any): void {
    this.languagesList = this.languagesList.filter(lang =>
      lang.name !== language.name || lang.level !== language.level
    );
  }
}
