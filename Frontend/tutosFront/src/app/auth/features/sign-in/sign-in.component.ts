import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  providers: [AuthService],
})
export default class SignInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) return;

    try {
      this.authService.login(this.email, this.password).subscribe({
        next: (res) => {
          this.authService.saveUserData(res.access, res.role);
          toast.success('¡Bienvenido de nuevo!');

          const token = res.token;
          const role = res.role;

          this.authService.saveUserData(token, role);

          // Redirige según role
          if (res.role === 'student') {
            this.router.navigate(['/user/student/details-tutor']);
          } else {
            this.router.navigate(['/user/tutor/form-personal-data']);
          }
        },
        error: (err) => {
          console.error('Error de login:', err);
          this.errorMessage = 'Correo o contraseña incorrectos';
          toast.error(this.errorMessage);
        },
      });
    } catch (error) {
      console.error('Error en el login:', error);
      this.errorMessage =
        'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
      toast.error(this.errorMessage);
    }
  }
}
