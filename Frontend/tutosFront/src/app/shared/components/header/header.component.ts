import { Component, ElementRef, HostListener, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable, map, Subscription, BehaviorSubject } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnDestroy {
  showDropdown = false;
  private authState = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean>;
  role$: Observable<string | null>;
  role: string = '';
  isLoggedIn = false;
  isStudent = false;
  isTutor = false;
  private authSubscription: Subscription | null = null;
  photo: string = '/default-avatar.jpg';
  userPersonalData: any = {};

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private eRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private Service: UserService
  ) {
    this.isLoggedIn$ = this.authState.asObservable();
    this.role$ = this.isLoggedIn$.pipe(
      map(loggedIn => loggedIn ? this.authService.getRole() : null)
    );
  }

  ngOnInit() {
    this.updateAuthState();

    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.authState.next(isLoggedIn);
      this.updateAuthState();
      this.cdr.detectChanges();
    });

    if (this.authService.isAuthenticated()) {
      this.role = this.authService.getRole() || '';
      this.loadProfileImage();
    }
  }

  private updateAuthState() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.isStudent = this.authService.isStudent();
    this.isTutor = this.authService.isTutor();
    this.cdr.detectChanges();
  }

  private loadProfileImage(): void {
    this.Service.getUserPersonalData().subscribe({
      next: data => {
        this.userPersonalData = data;
        this.photo = this.Service.getImageUrl(data.photo) + '?t=' + new Date().getTime();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error al obtener los datos personales:', error);
        toast.error('Error al cargar los datos del perfil');
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  private closeDropdown() {
    this.showDropdown = false;
    this.cdr.detectChanges();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
    this.cdr.detectChanges();
  }

  toProfile() {
    this.closeDropdown();
    this.router.navigate(['/user/profile']);
  }

  toPanel() {
    this.closeDropdown();
    this.router.navigate(['/user/tutor/mi-panel']);
  }

  logout() {
    this.closeDropdown();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
