import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface TutorPersonal {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  location: string;
  subjects: string[];
  rating: number;
  reviews: {
    name: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export interface TutorSkill {
  id: number;
  name: string;
  level: string;
}

export interface TutorProfessional {
  id: number;
  modality: string;
  fee_per_hour: number;
  about_me: string;
}

export interface TutorEducation {
  id: number;
  country: string;
  university: string;
  title: string;
  specialization: string;
  graduation_year: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorPersonalService {
  private apiUrl = 'http://127.0.0.1:8000/api/user/';
  private professionalApiUrl = 'http://127.0.0.1:8000/api/professional/';

  constructor(private http: HttpClient) {}

  getAllTutors(): Observable<TutorPersonal[]> {
    return this.http.get<any>(`${this.apiUrl}public/tutors/`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map((tutor: any) => ({
            id: tutor?.id || 0,
            first_name: tutor?.first_name || tutor?.user?.first_name || '',
            last_name: tutor?.last_name || tutor?.user?.last_name || '',
            photo: tutor?.photo || tutor?.user?.photo || '/default-avatar.jpg',
            location: tutor?.location || 'No especificado',
            subjects: tutor?.subjects || [],
            rating: tutor?.rating || 0
          }));
        }
        if (response?.results && Array.isArray(response.results)) {
          return response.results.map((tutor: any) => ({
            id: tutor?.id || 0,
            first_name: tutor?.first_name || tutor?.user?.first_name || '',
            last_name: tutor?.last_name || tutor?.user?.last_name || '',
            photo: tutor?.photo || tutor?.user?.photo || '/default-avatar.jpg',
            location: tutor?.location || 'No especificado',
            subjects: tutor?.subjects || [],
            rating: tutor?.rating || 0
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener información personal:', error);
        return of([]);
      })
    );
  }

  getTutorRating(tutorId: number): Observable<number> {
    return this.http.get<any>(`${this.professionalApiUrl}rating/${tutorId}/`).pipe(
      map(response => response?.rating || 0),
      catchError(error => {
        console.error('Error al obtener rating:', error);
        return of(0);
      })
    );
  }

  getTutorById(id: number): Observable<TutorPersonal> {
    return this.http.get<any>(`${this.apiUrl}public/tutors/${id}/`).pipe(
      map(response => ({
        id: response?.id || 0,
        first_name: response?.first_name || response?.user?.first_name || '',
        last_name: response?.last_name || response?.user?.last_name || '',
        photo: response?.photo || response?.user?.photo || '/default-avatar.jpg',
        location: response?.location || 'No especificado',
        subjects: response?.subjects || [],
        rating: response?.rating || 0,
        reviews: response?.reviews || []
      })),
      catchError(error => {
        console.error('Error al obtener tutor:', error);
        return of(this.getDefaultTutor());
      })
    );
  }

  private getDefaultTutor(): TutorPersonal {
    return {
      id: 0,
      first_name: '',
      last_name: '',
      photo: 'assets/images/default-avatar.png',
      location: 'No especificada',
      subjects: [],
      rating: 0,
      reviews: []
    };
  }

  deleteTutorLanguage(tutorId: number, languageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}languages/${languageId}/?tutor=${tutorId}`);
  }

  deleteTutorEducation(tutorId: number, educationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}educations/${educationId}/?tutor=${tutorId}`);
  }

  deleteTutorSkill(tutorId: number, skillId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}skills/${skillId}/?tutor=${tutorId}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class TutorProfessionalService {
  private apiUrl = 'http://127.0.0.1:8000/api/professional/';

  constructor(private http: HttpClient) {}

  getAllTutors(): Observable<TutorProfessional[]> {
    return this.http.get<any>(`${this.apiUrl}profile/`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map((tutor: any) => ({
            id: tutor?.id || 0,
            modality: tutor?.modality || 'No especificada',
            fee_per_hour: tutor?.fee_per_hour || 0,
            about_me: tutor?.about_me || ''
          }));
        }
        if (response?.results && Array.isArray(response.results)) {
          return response.results.map((tutor: any) => ({
            id: tutor?.id || 0,
            modality: tutor?.modality || 'No especificada',
            fee_per_hour: tutor?.fee_per_hour || 0,
            about_me: tutor?.about_me || ''
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener información profesional:', error);
        return of([]);
      })
    );
  }

  getTutorById(id: number): Observable<TutorProfessional> {
    return this.http.get<any>(`${this.apiUrl}profile/${id}/`).pipe(
      map(response => ({
        id: response?.id || 0,
        modality: response?.modality || 'No especificada',
        fee_per_hour: response?.fee_per_hour || 0,
        about_me: response?.about_me || ''
      })),
      catchError(error => {
        console.error('Error al obtener tutor:', error);
        return of(this.getDefaultTutor());
      })
    );
  }

  getTutorSkills(tutorId: number): Observable<TutorSkill[]> {
    return this.http.get<any>(`${this.apiUrl}skills/?tutor=${tutorId}`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map((skill: any) => ({
            id: skill?.id || 0,
            name: skill?.name || '',
            level: skill?.level || ''
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener skills del tutor:', error);
        return of([]);
      })
    );
  }

  getTutorEducation(tutorId: number): Observable<TutorEducation[]> {
    return this.http.get<any>(`${this.apiUrl}educations/?tutor=${tutorId}`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map((education: any) => ({
            id: education?.id || 0,
            country: education?.country || '',
            university: education?.university || '',
            title: education?.title || '',
            specialization: education?.specialization || '',
            graduation_year: education?.graduation_year || ''
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener educación del tutor:', error);
        return of([]);
      })
    );
  }

  private getDefaultTutor(): TutorProfessional {
    return {
      id: 0,
      modality: 'No especificada',
      fee_per_hour: 0,
      about_me: ''
    };
  }
} 