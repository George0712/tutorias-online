import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/user/';
  private apiUrl2 = 'http://127.0.0.1:8000/api/professional/';
  private educationList: any[] = [];
  private languageList: any[] = [];
  private SkillList: any[] = [];


  constructor(private http: HttpClient, private authService: AuthService) {}

  SavePersonalData(data: any): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    console.log('Token enviado:', token);

    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('id_number', data.id_number);
    formData.append('location', data.location);
    formData.append('birthdate', data.birthdate);
    formData.append('number_phone', data.number_phone);

    if (data.photo) {
      console.log('Foto añadida:', data.photo);
      formData.append(
        'photo',
        data.photo,
        data.photo.name || 'profile-picture'
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http
      .put(`${this.apiUrl}profile/user/`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            'Error en la petición al guardar la informacion:',
            error
          );
          return throwError(() => new Error(error));
        })
      );
  }

  SaveAdditionalData(data: any): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    console.log('Token enviado:', token);

    const formData = new FormData();
    formData.append('about_you', data.aboutYou);
    formData.append('hourly_rate', data.hourlyRate);
    formData.append('modality', data.modality);
    formData.append('education', data.education);
    formData.append('language', data.language);
    formData.append('skills', data.skills);

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http
      .put(`${this.apiUrl}profile/tutor/`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            'Error en la petición al guardar los datos adicionales:',
            error
          );
          return throwError(() => new Error(error));
        })
      );
  }

  setEducationList(data: any[]): void {
    this.educationList = data;
  }

  getEducationList(): any[] {
    return this.educationList;
  }

  setLanguageList(data: any[]): void {
    this.languageList = data;
  }
  
  getLanguageList(): any[] {
    return this.languageList;
  }

  setSkillList(data: any[]): void {
    this.SkillList = data;
  }
  
  getSkillList(): any[] {
    return this.SkillList;
  }
}
