import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://127.0.0.1:8000/api/user/"; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { email, password });
  }

  registerStudent(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}register/student/`, { email, password });
  }

  registerTutor(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}register/tutor/`, { email, password });
  }
  
  saveUserData(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isStudent(): boolean {
    return this.getRole() === 'student';
  }

  isTutor(): boolean {
    return this.getRole() === 'tutor';
  }

  logout() {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

}