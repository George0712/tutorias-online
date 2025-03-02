import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignInComponent } from './auth/features/sign-in/sign-in.component';
import { HeaderComponent } from './shared/components/header/header.component'; // Ensure this path is correct or create the file if it doesn't exist
import { SignUpComponent } from './auth/features/sign-up/sign-up.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SignInComponent, SignUpComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tutosFront';
}
