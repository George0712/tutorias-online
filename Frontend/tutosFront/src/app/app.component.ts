import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignInComponent } from './auth/features/sign-in/sign-in.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SignUpComponent } from './auth/features/sign-up/sign-up.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProfileTutorComponent} from './user/tutor/Profile/profileTutor.component';
import { ProfileStudentComponent } from './user/student/Profile/profileStudent.component';


@Component({
  selector: 'app-root',
  imports: [HeaderComponent, ProfileTutorComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tutosFront';
}
