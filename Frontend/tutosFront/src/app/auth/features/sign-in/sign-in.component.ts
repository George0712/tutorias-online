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
})
export default class SignInComponent {
  signInForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.signInForm.invalid) return;

    try {
      const { email, password } = this.signInForm.value;
      this.authService.login(email, password).subscribe({
        next: (res) => {
          // Agrega logs para inspeccionar la respuesta del backend
          console.log('Respuesta del backend:', res);
          console.log('Token:', res.token);
          console.log('Role:', res.role);
          console.log('Has Personal Data:', res.has_personal_data);
          console.log('Has Professional Data:', res.has_professional_data);

          toast.success('¡Bienvenido de nuevo!');
          this.router.navigate(['/home']);
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