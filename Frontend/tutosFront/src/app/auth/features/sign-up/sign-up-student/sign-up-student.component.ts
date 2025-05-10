import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './sign-up-student.component.html',
  styleUrl: './sign-up-student.component.css',
})
export default class SignUpStudentComponent {
  formRegisterStudent: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService){
    this.formRegisterStudent = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, {validators: this.passwordsMatchValidator});
  }

  isRequired(field: 'email' | 'password' | 'confirmPassword') {
      if (field === 'confirmPassword') {
          return this.formRegisterStudent.get(field)?.hasError('required') && this.formRegisterStudent.get(field)?.touched;
      }
      return isRequired(field, this.formRegisterStudent);
  }

  hasErrorEmail() {
    return hasErrorEmail(this.formRegisterStudent);
  }

  hasErrorPassword() {
    return hasErrorPassword(this.formRegisterStudent);
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.formRegisterStudent.invalid) return;

    try {
      const { email, password } = this.formRegisterStudent.value;
      if (!email || !password) return;

      this.authService.registerStudent(email, password).subscribe({
      next: (res) => {
        this.authService.saveUserData(res.access, 'student');
        console.log('datos a mandar:', res);
        toast.success('Usuario registrado con éxito!');
        // redirige
        this.router.navigate(['/auth/login']);
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
