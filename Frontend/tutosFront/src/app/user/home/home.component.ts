import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CardTutorComponent } from '../../shared/components/Cards/CardTutor/cardtutor.component';
import { TutorPersonalService, TutorProfessionalService, TutorPersonal, TutorProfessional } from '../../services/tutor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardTutorComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent implements OnInit {
  tutorsPersonal: TutorPersonal[] = [];
  tutorsProfessional: TutorProfessional[] = [];
  loading = false;
  searchTerm: string = '';
  selectedLocation: string = 'default';
  selectedEducationLevel: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  isOnline: boolean = false;

  constructor(
    private tutorPersonalService: TutorPersonalService,
    private tutorProfessionalService: TutorProfessionalService
  ) {}

  ngOnInit() {
    this.loadTutors();
  }

  loadTutors() {
    this.loading = true;
    forkJoin({
      personal: this.tutorPersonalService.getAllTutors(),
      professional: this.tutorProfessionalService.getAllTutors()
    }).subscribe({
      next: (data) => {
        this.tutorsPersonal = data.personal;
        this.tutorsProfessional = data.professional;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los tutores:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      console.log('Búsqueda:', this.searchTerm, 'Ubicación:', this.selectedLocation);
      // TODO: Implementar búsqueda de tutores
    }
  }

  onLocationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLocation = select.value;
  }
}
