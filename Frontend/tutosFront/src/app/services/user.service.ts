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
  readonly baseUrl = 'http://127.0.0.1:8000';


  constructor(private http: HttpClient, private authService: AuthService) { }

  guardarFoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file, file.name || 'profile-picture');

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });
    
    return this.actualizarSoloFoto(formData, headers);
  }

  actualizarSoloFoto(formData: FormData, headers: HttpHeaders): Observable<any> {
    return this.http.put(`${this.apiUrl}profile/user/`, formData, { headers });
  }

  getUserPersonalData(): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}profile/user/`, { headers }).pipe(
      catchError((error) => {
      console.error('Error al obtener los datos personales:', error);
      return throwError(() =>  new Error(error.message || 'Error desconocido'));
      })
    );
  }

  getUserAditionalData(): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl2}profile/`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener los datos adicionales:', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  SavePersonalData(data: any): Observable<any> {
    const token = this.authService.getToken();
    const role = this.authService.getRole();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    if (!role) {
      console.error('No hay rol disponible');
      return throwError(() => new Error('No hay rol disponible'));
    }

    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('id_number', data.id_number);
    formData.append('location', data.location);
    formData.append('number_phone', data.number_phone);

    // Campos opcionales
    if (data.birthdate) {
      formData.append('birthdate', data.birthdate);
    }
    
    if (data.photo) {
      formData.append('photo', data.photo);
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

  createAdditionalData(data: {
    about_me: string;
    fee_per_hour: string;
    modality: string;
  }): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const formData = new FormData();
    formData.append('about_me', data.about_me);
    formData.append('fee_per_hour', data.fee_per_hour);
    formData.append('modality', data.modality);

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http
      .post(`${this.apiUrl2}profile/`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            'Error en la petición al crear los datos adicionales:',
            error
          );
          return throwError(() => new Error(error));
        })
      );
  }


  updateAdditionalData(
    id: number,
    data: { about_me: string; fee_per_hour: string; modality: string }
  ): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const formData = new FormData();
    formData.append('about_me', data.about_me);
    formData.append('fee_per_hour', data.fee_per_hour);
    formData.append('modality', data.modality);

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    // IMPORTANTE: Apuntar a /profile/{id}/ cuando se actualiza
    return this.http
      .put(`${this.apiUrl2}profile/${id}/`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            'Error en la petición al actualizar los datos adicionales:',
            error
          );
          return throwError(() => new Error(error));
        })
      );
  }


  setEducationList(data: { 
    country: string, 
    university: string, 
    title: string, 
    specialization: string, 
    graduation_year: string 
  }): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });

    const formData = new FormData();
    formData.append('country', data.country);
    formData.append('university', data.university);
    formData.append('title', data.title);
    formData.append('specialization', data.specialization);
    formData.append('graduation_year', data.graduation_year);

    return this.http.post(`${this.apiUrl2}educations/`, formData, { headers }).pipe(
      catchError((error) => {
        console.error('Error completo al guardar la educación:', error);
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
        return throwError(() => new Error(error));
      })
    );
  }

  setLanguageList(data: { name: string, level: string }): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    const requestBody = {
      name: data.name,
      level: data.level
    };

    return this.http.post(`${this.apiUrl2}languages/`, requestBody, { headers }).pipe(
      catchError((error) => {
        console.error('Error completo al guardar el idioma:', error);
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
        return throwError(() => new Error(error));
      })
    );
  }

  setSkillList(data: { name: string, level: string }): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token obtenido:', token);

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    const requestBody = {
      name: data.name,
      level: data.level
    };

    console.log('Datos a enviar:', requestBody);

    return this.http.post(`${this.apiUrl2}skills/`, requestBody, { headers }).pipe(
      catchError((error) => {
        console.error('Error completo al guardar la habilidad:', error);
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
        return throwError(() => new Error(error));
      })
    );
  }

  getImageUrl(path: string): string {
    if (!path) {
      return '/default-avatar.jpg';
    }
    // ya es una URL absoluta
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // si viene con una barra al inicio (/media/...):
    if (path.startsWith('/')) {
      return `${this.baseUrl}${path}`;
    }
    // si viene sin slash (media/...):
    return `${this.baseUrl}/${path}`;
  }

  getUserEducation(): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl2}educations/`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener la educación:', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  getUserSkills(): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl2}skills/`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener las habilidades:', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  getUserSkillsById(userId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) return throwError(() => new Error('No hay token disponible'));
  
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });
  
    return this.http.get<any>(`${this.apiUrl2}skills/${userId}`, { headers }).pipe(
      catchError(error => throwError(() => new Error(error.message || 'Error desconocido')))
    );
  }
}
