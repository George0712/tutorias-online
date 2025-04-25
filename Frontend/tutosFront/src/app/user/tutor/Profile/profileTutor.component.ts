import { Component } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-profile-tutor',
  imports: [],
  templateUrl: './profileTutor.component.html',
  styleUrl: './profileTutor.component.css'
})
export class ProfileTutorComponent {
  profileTutorForm = new FormGroup({
    name : new FormControl(''),
    lastName : new FormControl(''),
    email : new FormControl(''),
    identification : new FormControl(''),
    location : new FormControl(''),
    phone : new FormControl(''),
  });

  profileAdicionalTutorForm = new FormGroup({
    aboutYou : new FormControl(''),
    hourlyRate : new FormControl(''),
  });

  onSubmit() {
    if (this.profileTutorForm.valid) {
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
