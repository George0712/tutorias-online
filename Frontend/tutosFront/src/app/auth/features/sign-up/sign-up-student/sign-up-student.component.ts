import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { hasErrorEmail, hasErrorPassword, isRequired } from '../../../utils/validators';
import { AuthService } from '../../../../services/auth.service';
import { toast } from 'ngx-sonner';


interface SignUpStudentForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up-student',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up-student.component.html',
  styleUrl: './sign-up-student.component.css',
})
export default class SignUpStudentComponent {
  private _formBuilder = inject(FormBuilder);
  private _AuthService = inject(AuthService);
  private router = inject(Router);

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.formRegisterStudent);
  }

  hasErrorEmail() {
    return hasErrorEmail(this.formRegisterStudent);
  }

  hasErrorPassword() {
    return hasErrorPassword(this.formRegisterStudent);
  }

  formRegisterStudent = this._formBuilder.group<SignUpStudentForm>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit() {
    if (this.formRegisterStudent.invalid) return;

    try {
      const { email, password } = this.formRegisterStudent.value;

      if (!email || !password) return;

      this._AuthService.registerStudent(email, password)
    .subscribe({
      next: (res) => {
        this._AuthService.saveUserData(res.access, 'student');
        toast.success('Usuario registrado con éxito!');
        // redirige
        this.router.navigate(['/details-tutor/student']);
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al registrar el usuario!');
      }
    });
    } catch (error) {
      toast.error('Error al registrar el usuario!');
    }
  }
}
