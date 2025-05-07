import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  providers: [AuthService],
})
export default class SignInComponent {

  signInForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.signInForm.invalid) return;

    try {
      const { email, password } = this.signInForm.value;
      this.authService.login(email, password).subscribe({
        next: (res) => {
          
          toast.success('¡Bienvenido de nuevo!');

          const token = res.token;
          const role = res.role;
          const hasPersonalData = res.has_personal_data;
          const hasProfessionalData = res.has_professional_data;

          this.authService.saveUserData(token, role, hasPersonalData, hasProfessionalData);

          // Redirige según role
          if (role === 'student') {
            if (!hasPersonalData) {
              this.router.navigate(['/user/student/form-personal-data']);
            } else {
              this.router.navigate(['/user/student/profile']);
            }
          } else if (role === 'tutor') {
            if (!hasPersonalData) {
              this.router.navigate(['/user/tutor/form-personal-data']);
            } else if (!hasProfessionalData) {
              this.router.navigate(['/user/tutor/form-aditional-data']);
            } else {
              this.router.navigate(['/user/tutor/profile']);
            }
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Error de login:', err);
          toast.error('Correo o contraseña incorrectos');
        },
      });
    } catch (error) {
      console.error('Error en el login:', error);
      toast.error('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.');
    }
  }
}
