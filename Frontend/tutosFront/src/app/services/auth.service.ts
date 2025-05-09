import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://127.0.0.1:8000/api/user/"; 
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable(); 

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { email, password });
  }

  registerStudent(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}register/student/`, { email, password });
  }

  registerTutor(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}register/tutor/`, { email, password });
  }
  
  saveUserData(token: string, role: string, hasPersonalData?: boolean, hasProfessionalData?: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    if (hasPersonalData !== undefined) {
      localStorage.setItem('hasPersonalData', String(hasPersonalData));
    }

    if (hasProfessionalData !== undefined) {
      localStorage.setItem('hasProfessionalData', String(hasProfessionalData));
    }
    this.loggedIn.next(true);
  }

  isStudent(): boolean {
    return this.getRole() === 'student';
  }

  isTutor(): boolean {
    return this.getRole() === 'tutor';
  }

  getRole(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role');
    }
    return null;
  }
  
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
  
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      localStorage.removeItem('token');
    }
    this.loggedIn.next(false);
  }

  updateAuthStatus() {
    this.loggedIn.next(this.isAuthenticated());
  }
}