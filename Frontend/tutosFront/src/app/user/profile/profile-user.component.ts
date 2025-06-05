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
import { ProfileService } from '../../services/profile.service';
import { TutorPersonal } from '../../services/tutor.service';

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
  profileForm!: FormGroup;
  profileAdicionalForm!: FormGroup;
  
  userPersonalData: UserPersonalData = {
    first_name: '',
    last_name: '',
    id_number: '',
    location: '',
    birthdate: '',
    number_phone: '',
    photo: ''
  };
  
  tutorAdditionalInfo: TutorAdditionalInfo = {
    about_me: '',
    fee_per_hour: 0,
    modality: ''
  };
  
  languagesList: Language[] = [];
  educationList: Education[] = [];
  skillsList: Skill[] = [];
  
  role: string = 'tutor'; // Esto debería venir del servicio de autenticación
  isLoadingAdditional: boolean = false;
  isLoadingPersonal: boolean = false;
  tutorId: number | null = null;
  
  // Modal state
  isModalOpen: boolean = false;
  modalType: string = '';
  modalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Obtener el rol del usuario desde el servicio de autenticación
    this.role = this.authService.getRole() || 'tutor';
    
    // Obtener el ID del tutor desde el servicio de autenticación
    this.tutorId = this.authService.getUserId();
    
    this.loadUserData();
    if (this.role === 'tutor' && this.tutorId) {
      this.loadTutorAdditionalData();
    }
  }

  initializeForms(): void {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      id_number: ['', [Validators.required, Validators.pattern(/^\d{8,12}$/)]],
      location: ['', Validators.required],
      birthdate: ['', Validators.required],
      number_phone: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]]
    });

    this.profileAdicionalForm = this.fb.group({
      about_me: ['', [Validators.maxLength(1000)]],
      fee_per_hour: ['', [Validators.min(10000)]],
      modality: ['']
    });

    this.initializeModalForm();
  }

  initializeModalForm(): void {
    this.modalForm = this.fb.group({
      // Para idiomas
      language_name: [''],
      language_level: [''],
      
      // Para educación
      institution: [''],
      degree: [''],
      field_of_study: [''],
      start_date: [''],
      end_date: [''],
      is_current: [false],
      description: [''],
      
      // Para habilidades
      skill_name: [''],
      skill_level: ['']
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  get fa() {
    return this.profileAdicionalForm.controls;
  }

  loadUserData(): void {
    // Usar el ProfileService en lugar del UserService para consistencia
    this.userService.getUserPersonalData().subscribe({
      next: (data) => {
        console.log('User profile data loaded:', data);
        this.userPersonalData = data;
        this.profileForm.patchValue(data);
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        toast.error('Error al cargar los datos del usuario');
      }
    });
  }

  loadTutorAdditionalData(): void {
    if (!this.tutorId) return;

    // Cargar información adicional
    this.profileService.getTutorAdditionalInfo(this.tutorId).subscribe({
      next: (data) => {
        console.log('Additional info loaded:', data);
        this.tutorAdditionalInfo = data;
        // Patchear el formulario con los datos recibidos
        this.profileAdicionalForm.patchValue({
          about_me: data.about_me || '',
          fee_per_hour: data.fee_per_hour || 0,
          modality: data.modality || ''
        });
      },
      error: (error) => {
        console.error('Error loading additional info:', error);
        if (error.status !== 404) {
          toast.error('Error al cargar la información adicional');
        }
      }
    });

    // Cargar idiomas del usuario actual
    this.profileService.getTutorLanguages(this.tutorId).subscribe({
      next: (data) => {
        console.log('Languages loaded:', data);
        this.languagesList = data;
      },
      error: (error) => {
        console.error('Error loading languages:', error);
        if (error.status !== 404) {
          toast.error('Error al cargar los idiomas');
        }
      }
    });

    // Cargar educación del usuario actual
    this.profileService.getTutorEducation(this.tutorId).subscribe({
      next: (data) => {
        console.log('Education loaded:', data);
        this.educationList = data;
      },
      error: (error) => {
        console.error('Error loading education:', error);
        if (error.status !== 404) {
          toast.error('Error al cargar la educación');
        }
      }
    });

    // Cargar habilidades del usuario actual
    this.profileService.getTutorSkills(this.tutorId).subscribe({
      next: (data) => {
        console.log('Skills loaded:', data);
        this.skillsList = data;
      },
      error: (error) => {
        console.error('Error loading skills:', error);
        if (error.status !== 404) {
          toast.error('Error al cargar las habilidades');
        }
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoadingPersonal = true;
      
      const formData = { ...this.profileForm.value };
      
      this.profileService.updateUserProfile(formData).subscribe({
        next: (response) => {
          toast.success('Perfil actualizado correctamente');
          this.userPersonalData = { ...this.userPersonalData, ...formData };
          this.isLoadingPersonal = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          toast.error('Error al actualizar el perfil');
          this.isLoadingPersonal = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  onSubmitAdicional(): void {
    if (this.profileAdicionalForm.valid && this.tutorId) {
      this.isLoadingAdditional = true;
      
      const formData = { ...this.profileAdicionalForm.value };
      
      this.profileService.updateTutorAdditionalInfo(this.tutorId, formData).subscribe({
        next: (response) => {
          this.tutorAdditionalInfo = response;
          this.isLoadingAdditional = false;
          toast.success('Información adicional actualizada exitosamente');
        },
        error: (error) => {
          console.error('Error updating additional info:', error);
          this.isLoadingAdditional = false;
          toast.error('Error al actualizar la información adicional');
        }
      });
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño de archivo (por ejemplo, máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }

      this.profileService.uploadProfileImage(file).subscribe({
        next: (response) => {
          this.userPersonalData.photo = response.photo_url;
          toast.success('Foto de perfil actualizada');
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          toast.error('Error al subir la imagen');
        }
      });
    }
  }

  openModal(type: string): void {
    this.modalType = type;
    this.isModalOpen = true;
    this.modalForm.reset();
    
    // Configurar validadores según el tipo de modal
    this.configureModalValidators(type);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalType = '';
    this.modalForm.reset();
  }

  configureModalValidators(type: string): void {
    // Limpiar todos los validadores
    Object.keys(this.modalForm.controls).forEach(key => {
      this.modalForm.get(key)?.clearValidators();
      this.modalForm.get(key)?.updateValueAndValidity();
    });

    switch (type) {
      case 'languaje':
        this.modalForm.get('language_name')?.setValidators([Validators.required]);
        this.modalForm.get('language_level')?.setValidators([Validators.required]);
        break;
      case 'education':
        this.modalForm.get('institution')?.setValidators([Validators.required]);
        this.modalForm.get('degree')?.setValidators([Validators.required]);
        this.modalForm.get('start_date')?.setValidators([Validators.required]);
        break;
      case 'skills':
        this.modalForm.get('skill_name')?.setValidators([Validators.required]);
        this.modalForm.get('skill_level')?.setValidators([Validators.required]);
        break;
    }
  }

  onModalSubmit(): void {
    if (this.modalForm.valid) {
      switch (this.modalType) {
        case 'languaje':
          this.addLanguage();
          break;
        case 'education':
          this.addEducation();
          break;
        case 'skills':
          this.addSkill();
          break;
      }
    } else {
      this.markFormGroupTouched(this.modalForm);
    }
  }

  addLanguage(): void {
    if (this.modalForm.valid && this.tutorId) {
      const languageData = {
        name: this.modalForm.get('language_name')?.value,
        level: this.modalForm.get('language_level')?.value
      };

      this.profileService.addTutorLanguage(this.tutorId, languageData).subscribe({
        next: (response) => {
          this.languagesList.push(response);
          this.closeModal();
          toast.success('Idioma agregado exitosamente');
        },
        error: (error) => {
          console.error('Error adding language:', error);
          toast.error('Error al agregar el idioma');
        }
      });
    }
  }

  addEducation(): void {
    if (this.modalForm.valid && this.tutorId) {
      const educationData = {
        institution: this.modalForm.get('institution')?.value,
        degree: this.modalForm.get('degree')?.value,
        field_of_study: this.modalForm.get('field_of_study')?.value,
        start_date: this.modalForm.get('start_date')?.value,
        end_date: this.modalForm.get('end_date')?.value,
        is_current: this.modalForm.get('is_current')?.value,
        description: this.modalForm.get('description')?.value
      };

      this.profileService.addTutorEducation(this.tutorId, educationData).subscribe({
        next: (response) => {
          this.educationList.push(response);
          this.closeModal();
          toast.success('Educación agregada exitosamente');
        },
        error: (error) => {
          console.error('Error adding education:', error);
          toast.error('Error al agregar la educación');
        }
      });
    }
  }

  addSkill(): void {
    if (this.modalForm.valid && this.tutorId) {
      const skillData = {
        name: this.modalForm.get('skill_name')?.value,
        level: this.modalForm.get('skill_level')?.value
      };

      this.profileService.addTutorSkill(this.tutorId, skillData).subscribe({
        next: (response) => {
          this.skillsList.push(response);
          this.closeModal();
          toast.success('Habilidad agregada exitosamente');
        },
        error: (error) => {
          console.error('Error adding skill:', error);
          toast.error('Error al agregar la habilidad');
        }
      });
    }
  }

  deleteLanguage(languageId: number): void {
    if (this.tutorId) {
      this.profileService.deleteTutorLanguage(this.tutorId, languageId).subscribe({
        next: () => {
          this.languagesList = this.languagesList.filter(lang => lang.id !== languageId);
          toast.success('Idioma eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error deleting language:', error);
          toast.error('Error al eliminar el idioma');
        }
      });
    }
  }

  deleteEducation(educationId: number): void {
    if (this.tutorId) {
      this.profileService.deleteTutorEducation(this.tutorId, educationId).subscribe({
        next: () => {
          this.educationList = this.educationList.filter(edu => edu.id !== educationId);
          toast.success('Educación eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error deleting education:', error);
          toast.error('Error al eliminar la educación');
        }
      });
    }
  }

  deleteSkill(skillId: number): void {
    if (this.tutorId) {
      this.profileService.deleteTutorSkill(this.tutorId, skillId).subscribe({
        next: () => {
          this.skillsList = this.skillsList.filter(skill => skill.id !== skillId);
          toast.success('Habilidad eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error deleting skill:', error);
          toast.error('Error al eliminar la habilidad');
        }
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}