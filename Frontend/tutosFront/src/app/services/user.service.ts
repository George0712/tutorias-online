import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError, tap, switchMap } from 'rxjs';

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

    console.log('Obteniendo datos adicionales de:', `${this.apiUrl2}profile/`);
    
    return this.http.get<any>(`${this.apiUrl2}profile/`, { headers }).pipe(
      tap(response => {
        console.log('Respuesta del servidor (datos adicionales):', response);
      }),
      catchError((error) => {
        console.error('Error al obtener los datos adicionales:', error);
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
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

  SaveAdditionalData(
    id: number,
    data: { about_me: string; fee_per_hour: string; modality: string }
  ): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const requestBody = {
      about_me: data.about_me,
      fee_per_hour: data.fee_per_hour,
      modality: data.modality
    };

    console.log('Enviando datos adicionales:', requestBody);

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    });

    // Si id es 0, es una creación, si no, es una actualización
    const url = id === 0 ? `${this.apiUrl2}profile/` : `${this.apiUrl2}profile/${id}/`;
    const method = id === 0 ? 'post' : 'put';

    console.log(`Realizando ${method.toUpperCase()} a ${url} con datos:`, requestBody);
    console.log('Headers:', headers);

    return this.http[method](url, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Respuesta del servidor:', response);
        if (!response) {
          throw new Error('No se recibió respuesta del servidor');
        }
      }),
      catchError((error) => {
        console.error('Error en la petición:', error);
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        if (error.error) {
          console.error('Detalles del error:', error.error);
          // Si hay errores específicos del servidor, los propagamos
          if (error.error.detail) {
            return throwError(() => new Error(error.error.detail));
          }
          if (error.error.non_field_errors) {
            return throwError(() => new Error(error.error.non_field_errors.join(', ')));
          }
          // Si hay errores de validación, los propagamos
          const validationErrors = Object.entries(error.error)
            .filter(([key]) => key !== 'detail')
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          if (validationErrors) {
            return throwError(() => new Error(validationErrors));
          }
        }
        return throwError(() => new Error('Error al procesar la solicitud'));
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

  setProfessionalProfile(data: { 
    about_me: string, 
    fee_per_hour: number, 
    modality: string 
  }): Observable<any> {
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
      about_me: data.about_me,
      fee_per_hour: data.fee_per_hour,
      modality: data.modality
    };

    console.log('Datos a enviar:', requestBody);

    // Primero obtenemos el perfil actual para obtener el ID
    return this.getUserAditionalData().pipe(
      tap(response => {
        console.log('Perfil actual:', response);
        if (!response || !Array.isArray(response) || response.length === 0) {
          throw new Error('No se encontró el perfil profesional');
        }
      }),
      switchMap(response => {
        // Tomamos el perfil más reciente (el primero del array)
        const profileId = response[0].id;
        console.log('Actualizando perfil con ID:', profileId);
        return this.http.put(`${this.apiUrl2}profile/${profileId}/`, requestBody, { headers });
      }),
      catchError((error) => {
        console.error('Error completo al actualizar el perfil profesional:', error);
        if (error.error) {
          console.error('Detalles del error:', error.error);
          if (error.error.detail) {
            return throwError(() => new Error(error.error.detail));
          }
        }
        return throwError(() => new Error('Error al actualizar el perfil profesional'));
      })
    );
  }

  getUserLanguages(): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl2}languages/`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener los idiomas:', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  deleteLanguage(id: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl2}languages/${id}/`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar el idioma:', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  deleteEducation(id: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl2}educations/${id}/`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar la educación:', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  deleteSkill(id: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl2}skills/${id}/`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar la habilidad:', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }
}
