import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface Tutor {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  location: string;
  modality: string;
  hourly_rate: number;
  rating: number;
  subjects: string[];
  about_you: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private apiUrl = 'http://127.0.0.1:8000/api/professional/';

  constructor(private http: HttpClient) {}

  getAllTutors(): Observable<Tutor[]> {
    return this.http.get<any>(`${this.apiUrl}profile/tutor/`).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response); // Debug
        if (Array.isArray(response)) {
          return response.map((tutor: any) => this.mapTutorData(tutor));
        }
        if (response?.results && Array.isArray(response.results)) {
          return response.results.map((tutor: any) => this.mapTutorData(tutor));
        }
        if (response && typeof response === 'object') {
          return [this.mapTutorData(response)];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener tutores:', error);
        return of([]);
      })
    );
  }

  getTutorById(id: number): Observable<Tutor> {
    return this.http.get<any>(`${this.apiUrl}profile/tutor/${id}/`).pipe(
      map(response => {
        console.log('Respuesta del tutor:', response); // Debug
        return this.mapTutorData(response);
      }),
      catchError(error => {
        console.error('Error al obtener tutor:', error);
        return of(this.getDefaultTutor());
      })
    );
  }

  private mapTutorData(data: any): Tutor {
    console.log('Mapeando datos del tutor:', data); // Debug
    return {
      id: data?.id || 0,
      first_name: data?.first_name || data?.user?.first_name || '',
      last_name: data?.last_name || data?.user?.last_name || '',
      photo: data?.photo || data?.user?.photo || 'assets/images/default-avatar.png',
      location: data?.location || 'No especificada',
      modality: data?.modality || 'No especificada',
      hourly_rate: data?.hourly_rate || 0,
      rating: data?.rating || 0,
      subjects: Array.isArray(data?.subjects) ? data.subjects : [],
      about_you: data?.about_you || ''
    };
  }

  private getDefaultTutor(): Tutor {
    return {
      id: 0,
      first_name: '',
      last_name: '',
      photo: 'assets/images/default-avatar.png',
      location: 'No especificada',
      modality: 'No especificada',
      hourly_rate: 0,
      rating: 0,
      subjects: [],
      about_you: ''
    };
  }
} 