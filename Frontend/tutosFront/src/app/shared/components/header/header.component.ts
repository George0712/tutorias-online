import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isLoggedIn: boolean | null = null;
  showDropdown = false;
  role: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.updateAuthStatus();
    this.role = this.authService.getRole();
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.authService.updateAuthStatus();
      });
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn; // Verifica el valor en la consola
    });
  }

  irAMiPerfil() {
    if (this.role === 'student') {
      this.router.navigate(['/user/student/profile']);
    } else if (this.role === 'tutor') {
      this.router.navigate(['/user/tutor/profile']);
    }
  }

  logout() {
    this.authService.logout();
    this.authService.updateAuthStatus();
    this.router.navigate(['/']);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

}
