// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserProfile {
  first_name: string;
  last_name: string;
  id_number: string;
  location: string;
  birthdate: string;
  number_phone: string;
  photo?: string;
}

interface TutorAdditionalInfo {
  about_me: string;
  fee_per_hour: number;
  modality: string;
}

interface Language {
  id?: number;
  name: string;
  level: string;
}

interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

interface Skill {
  id?: number;
  name: string;
  level: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://127.0.0.1:8000'; 
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Métodos para perfil general
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/api/user/profile/user`, {
      headers: this.getHeaders()
    });
  }

  updateUserProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/api/user/profile/user`, profileData, {
      headers: this.getHeaders()
    });
  }

  uploadProfileImage(file: File): Observable<{photo_url: string}> {
    const formData = new FormData();
    formData.append('photo', file);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // No incluir Content-Type para FormData
    });

    return this.http.post<{photo_url: string}>(`${this.apiUrl}/api/user/upload-photo/`, formData, {
      headers: headers
    });
  }

  // Métodos para información adicional del tutor
  getTutorAdditionalInfo(tutorId: number): Observable<TutorAdditionalInfo> {
    return this.http.get<TutorAdditionalInfo>(`${this.apiUrl}/api/professional/profile/${tutorId}/`, {
      headers: this.getHeaders()
    });
  }

  updateTutorAdditionalInfo(tutorId: number, additionalInfo: Partial<TutorAdditionalInfo>): Observable<TutorAdditionalInfo> {
    return this.http.put<TutorAdditionalInfo>(`${this.apiUrl}/api/professional/profile/${tutorId}/`, additionalInfo, {
      headers: this.getHeaders()
    });
  }

  // Métodos para idiomas - Solo del usuario logueado
  getTutorLanguages(tutorId: number): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.apiUrl}/api/professional/languages/${tutorId}/`, {
      headers: this.getHeaders()
    });
  }

  addTutorLanguage(tutorId: number, language: Omit<Language, 'id'>): Observable<Language> {
    return this.http.post<Language>(`${this.apiUrl}/api/professional/languages/${tutorId}/`, language, {
      headers: this.getHeaders()
    });
  }

  deleteTutorLanguage(tutorId: number, languageId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/api/professional/languages/${tutorId}/${languageId}/delete/`, {
      headers: this.getHeaders()
    });
  }

  // Métodos para educación - Solo del usuario logueado
  getTutorEducation(tutorId: number): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/api/professional/educations/${tutorId}/`, {
      headers: this.getHeaders()
    });
  }

  addTutorEducation(tutorId: number, education: Omit<Education, 'id'>): Observable<Education> {
    return this.http.post<Education>(`${this.apiUrl}/api/professional/educations/${tutorId}/`, education, {
      headers: this.getHeaders()
    });
  }

  deleteTutorEducation(tutorId: number, educationId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/api/professional/educations/${tutorId}/${educationId}/delete/`, {
      headers: this.getHeaders()
    });
  }

  // Métodos para habilidades - Solo del usuario logueado
  getTutorSkills(tutorId: number): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/api/professional/skills/${tutorId}/`, {
      headers: this.getHeaders()
    });
  }

  addTutorSkill(tutorId: number, skill: Omit<Skill, 'id'>): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}/api/professional/skills/${tutorId}/`, skill, {
      headers: this.getHeaders()
    });
  }

  deleteTutorSkill(tutorId: number, skillId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/api/professional/skills/${tutorId}/${skillId}/delete/`, {
      headers: this.getHeaders()
    });
  }
}