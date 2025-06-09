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

interface UserPersonalData {
  first_name: string;
  last_name: string;
  id_number: string;
  location: string;
  birthdate: string;
  number_phone: string;
  photo?: string;
}

interface TutorAdditionalInfo {
  id?: number;
  about_me: string;
  fee_per_hour: number;
  modality: string;
}

interface Language {
  id?: number;
  name: string;
  level: string;
}

interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

interface Skill {
  id?: number;
  name: string;
  level: string;
}

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
  userPersonalData: UserPersonalData = {} as UserPersonalData;
  userAditionalData: TutorAdditionalInfo = {} as TutorAdditionalInfo;
  role: string = '';
  languagesList: Language[] = [];
  educationList: Education[] = [];
  skillsList: Skill[] = [];

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
      fee_per_hour: ['', [Validators.required, Validators.min(10000), Validators.max(1000000)]],
      modality: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getUserPersonalData();
      this.getUserAditionalData();
      this.role = this.authService.getRole() || '';
      if (this.role === 'tutor') {
        this.loadLanguages();
        this.loadEducation();
        this.loadSkills();
      }
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
        console.log('Respuesta completa de datos adicionales:', data);
        // Si la respuesta es un array, tomamos el primer elemento
        this.userAditionalData = Array.isArray(data) ? data[0] : data;
        console.log('Datos adicionales procesados:', this.userAditionalData);
        console.log('ID del perfil:', this.userAditionalData?.id);
        
        if (this.userAditionalData) {
          this.profileAdicionalForm.patchValue({
            about_me: this.userAditionalData.about_me || '',
            fee_per_hour: this.userAditionalData.fee_per_hour || '',
            modality: this.userAditionalData.modality || ''
          });
          console.log('Formulario actualizado con valores:', this.profileAdicionalForm.value);
        } else {
          console.log('No se encontraron datos adicionales');
        }
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
    console.log('Se envió el formulario adicional');
    console.log('Estado del formulario:', this.profileAdicionalForm.status);
    console.log('Errores del formulario:', this.profileAdicionalForm.errors);
    console.log('Valores del formulario:', this.profileAdicionalForm.value);
    
    if (this.profileAdicionalForm.invalid) {
      console.log('Formulario inválido');
      this.markAllAsTouched();
      return;
    }

    const formValues = this.profileAdicionalForm.value;
    console.log('Valores del formulario:', formValues);

    const dataToSend = {
      about_me: formValues.about_me,
      fee_per_hour: formValues.fee_per_hour,
      modality: formValues.modality,
    };
    console.log('Datos a enviar:', dataToSend);

    this.Service.setProfessionalProfile(dataToSend).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.userAditionalData = response;
        this.profileAdicionalForm.patchValue({
          about_me: response.about_me,
          fee_per_hour: response.fee_per_hour,
          modality: response.modality
        });
        toast.success('Datos adicionales guardados correctamente');
      },
      error: (err) => {
        console.error('Error al guardar datos adicionales:', err);
        if (err.error) {
          console.error('Detalles del error:', err.error);
        }
        toast.error('Hubo un problema al guardar los datos adicionales');
      }
    });
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
            this.loadLanguages();
          }
        });
        break;
      case 'education':
        const educationDialogRef = this.dialog.open(ModalEducationComponent, {
          width: '500px',
          disableClose: true
        });
        educationDialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadEducation();
          }
        });
        break;
      case 'skills':
        const skillsDialogRef = this.dialog.open(ModalSkillsComponent, {
          width: '500px',
          disableClose: true
        });
        skillsDialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadSkills();
          }
        });
        break;
    }
  }

  loadLanguages(): void {
    this.Service.getUserLanguages().subscribe({
      next: (data: Language[]) => {
        this.languagesList = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar los idiomas:', error);
        toast.error('Error al cargar los idiomas');
      }
    });
  }

  loadEducation(): void {
    this.Service.getUserEducation().subscribe({
      next: (data: Education[]) => {
        this.educationList = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar la educación:', error);
        toast.error('Error al cargar la educación');
      }
    });
  }

  loadSkills(): void {
    this.Service.getUserSkills().subscribe({
      next: (data: Skill[]) => {
        this.skillsList = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar las habilidades:', error);
        toast.error('Error al cargar las habilidades');
      }
    });
  }

  deleteLanguage(id: number): void {
    this.Service.deleteLanguage(id).subscribe({
      next: () => {
        this.languagesList = this.languagesList.filter(lang => lang.id !== id);
        toast.success('Idioma eliminado correctamente');
      },
      error: (error: Error) => {
        console.error('Error al eliminar el idioma:', error);
        toast.error('Error al eliminar el idioma');
      }
    });
  }

  deleteEducation(id: number): void {
    this.Service.deleteEducation(id).subscribe({
      next: () => {
        this.educationList = this.educationList.filter(edu => edu.id !== id);
        toast.success('Educación eliminada correctamente');
      },
      error: (error: Error) => {
        console.error('Error al eliminar la educación:', error);
        toast.error('Error al eliminar la educación');
      }
    });
  }

  deleteSkill(id: number): void {
    this.Service.deleteSkill(id).subscribe({
      next: () => {
        this.skillsList = this.skillsList.filter(skill => skill.id !== id);
        toast.success('Habilidad eliminada correctamente');
      },
      error: (error: Error) => {
        console.error('Error al eliminar la habilidad:', error);
        toast.error('Error al eliminar la habilidad');
      }
    });
  }
}
