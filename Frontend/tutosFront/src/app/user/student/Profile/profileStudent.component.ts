import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-student',
  imports: [],
  templateUrl: './profileStudent.component.html',
  styleUrl: './profileStudent.component.css'
})
export class ProfileStudentComponent {
  profileStudentForm = new FormGroup({
    name: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    identification: new FormControl(''),
    location: new FormControl(''),
    phone: new FormControl(''),
  });

  onSubmit() {
    if (this.profileStudentForm.valid) {
      console.log("Se envio el formulario");
      /*
      this.tutorService.saveProfile(this.profileForm.value).subscribe(response => {
        console.log('Profile saved:', response);
      }, error => {
        console.error('Error saving profile:', error);
      });
      */
    }
  }

}
