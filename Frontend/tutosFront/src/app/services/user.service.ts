import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/user/';

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
        formData.append('photo', data.photo, data.photo.name || 'profile-picture');
      }

    const headers = new HttpHeaders({
        Authorization: `Token ${token}`
      });

    return this.http.put(`${this.apiUrl}profile/user/`, formData, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la petición al guardar la informacion:', error);
        return throwError(() => new Error(error));
      })
    );
  }
}
