import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { hasErrorEmail, hasErrorPassword, isRequired } from '../../../utils/validators';

import { toast } from 'ngx-sonner';

interface SignUpTutorForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up-tutor',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './sign-up-tutor.component.html',
  styleUrl: './sign-up-tutor.component.css',
})
export default class SignUpTutorComponent {
  formRegisterTutor: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService){
    this.formRegisterTutor = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required],
    }, {validators: this.passwordsMatchValidator});
  }

  isRequired(field: 'email' | 'password' | 'confirmPassword') {
      if (field === 'confirmPassword') {
          return this.formRegisterTutor.get(field)?.hasError('required') && this.formRegisterTutor.get(field)?.touched;
      }
      return isRequired(field, this.formRegisterTutor);
  }

  hasErrorEmail() {
      return hasErrorEmail(this.formRegisterTutor);
    }
  
    hasErrorPassword() {
      return hasErrorPassword(this.formRegisterTutor);
    }

    passwordsMatchValidator(form: FormGroup) {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }

  onSubmit() {
    if (this.formRegisterTutor.invalid) return;

    try {
      const { email, password } = this.formRegisterTutor.value;
      if (!email || !password) return;

      this.authService.registerTutor(email, password).subscribe({
        next: (res) => {
          this.authService.saveUserData(res.access, 'tutor');
          toast.success('Usuario registrado con éxito!');
          // redirige
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error(err);
          toast.error('Error al registrar el usuario!');
        },
      });
    } catch (error) {
      toast.error('Error al registrar el usuario!');
    }
  }
}
