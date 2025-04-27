import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up-tutor.component.html',
  styleUrl: './sign-up-tutor.component.css',
})
export default class SignUpTutorComponent {
  private _formBuilder = inject(FormBuilder);
  private _AuthService = inject(AuthService);
  private router = inject(Router);

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.formRegisterTutor);
  }

  hasErrorEmail() {
      return hasErrorEmail(this.formRegisterTutor);
    }
  
    hasErrorPassword() {
      return hasErrorPassword(this.formRegisterTutor);
    }

  formRegisterTutor = this._formBuilder.group<SignUpTutorForm>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: this._formBuilder.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ]),
  });

  onSubmit() {
    if (this.formRegisterTutor.invalid) return;

    try {
      const { email, password } = this.formRegisterTutor.value;

      if (!email || !password) return;

      this._AuthService.registerTutor(email, password).subscribe({
        next: (res) => {
          this._AuthService.saveUserData(res.access, 'student');
          toast.success('Usuario registrado con éxito!');
          // redirige
          this.router.navigate(['/details-tutor/student']);
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
