import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SignUpComponent } from './auth/features/sign-up/sign-up.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProfileTutorComponent} from './user/tutor/Profile/profileTutor.component';
import { ProfileStudentComponent } from './user/student/Profile/profileStudent.component';
import { DetailtutorComponent } from './user/student/DetailTutor/detailtutor.component';
import { SignInComponent } from './auth/features/sign-in/sign-in.component';


@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SignInComponent,FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tutosFront';
}
