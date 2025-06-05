import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  token: string;
  role: string;
  has_personal_data: boolean;
  has_professional_data: boolean;
  is_first_login: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://127.0.0.1:8000/api/user/"; 
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initializeAuthState();
    }
  }

  private initializeAuthState() {
    if (!this.isBrowser) return;
    
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      this.loggedIn.next(true);
    }
  }

  private checkInitialAuthState(): boolean {
    if (!this.isBrowser) return false;
    
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return !!(token && role);
  }

  private getUserIdFromToken(): number | null {
    if (!this.isBrowser) return null;
    
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login/`, { email, password }).pipe(
      tap(response => {
        this.saveUserData(
          response.token,
          response.role,
          response.has_personal_data,
          response.has_professional_data,
          response.is_first_login
        );
      })
    );
  }

  setLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }

  registerStudent(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}register/student/`, { email, password });
  }

  registerTutor(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}register/tutor/`, { email, password });
  }
  
  saveUserData(token: string, role: string, hasPersonalData?: boolean, hasProfessionalData?: boolean, isFirstLogin?: boolean) {
    if (!this.isBrowser) return;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    if (hasPersonalData !== undefined) {
      localStorage.setItem('hasPersonalData', String(hasPersonalData));
    }

    if (hasProfessionalData !== undefined && role === 'tutor') {
      localStorage.setItem('hasProfessionalData', String(hasProfessionalData));
    }

    if (isFirstLogin !== undefined) {
      localStorage.setItem('firstLogin', String(isFirstLogin));
    }
  }

  isStudent(): boolean {
    return this.getRole() === 'student';
  }

  isTutor(): boolean {
    return this.getRole() === 'tutor';
  }

  getRole(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('role');
  }
  
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    return this.getUserIdFromToken();
  }
  
  isAuthenticated(): boolean {
    return this.checkInitialAuthState();
  }

  isFirstLogin(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem('isFirstLogin') === 'true';
  }
  
  logout() {
    if (!this.isBrowser) return;
    
    localStorage.clear();
    this.setLoggedIn(false);
  }
}