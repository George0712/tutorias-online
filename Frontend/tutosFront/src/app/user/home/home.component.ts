import { Component, OnInit } from '@angular/core';
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
  styleUrl: './home.component.css'
})
export default class HomeComponent implements OnInit {
  tutorsPersonal: TutorPersonal[] = [];
  tutorsProfessional: TutorProfessional[] = [];
  filteredTutorsPersonal: TutorPersonal[] = [];
  filteredTutorsProfessional: TutorProfessional[] = [];
  loading = true;
  searchTerm: string = '';
  selectedLocation: string = 'default';
  selectedEducationLevel: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  isOnline: boolean = false;
  hasActiveFilters: boolean = false;

  // Array para el skeleton loader
  skeletonCards = Array(6).fill(0);

  // Mapa de ubicaciones
  private locationMap: { [key: string]: string } = {
    'bq': 'Barranquilla',
    'ct': 'Cartagena',
    'cr': 'Cúcuta',
    'bp': 'Bogotá',
    'ca': 'Cali',
    'ba': 'Barrancabermeja',
    'by': 'Bucaramanga'
  };

  constructor(
    private tutorPersonalService: TutorPersonalService,
    private tutorProfessionalService: TutorProfessionalService
  ) {}

  ngOnInit() {
    this.loadTutors();
  }

  loadTutors() {
    forkJoin({
      personal: this.tutorPersonalService.getAllTutors(),
      professional: this.tutorProfessionalService.getAllTutors()
    }).subscribe({
      next: (data) => {
        this.tutorsPersonal = data.personal;
        this.tutorsProfessional = data.professional;
        this.filteredTutorsPersonal = [...this.tutorsPersonal];
        this.filteredTutorsProfessional = [...this.tutorsProfessional];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los tutores:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.hasActiveFilters = true;
    this.applyFilters();
  }

  onLocationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLocation = select.value;
    this.hasActiveFilters = true;
    this.applyFilters();
  }

  applyFilters() {
    let filteredPersonal = [...this.tutorsPersonal];
    let filteredProfessional = [...this.tutorsProfessional];

    // Filtrar por término de búsqueda (nombre, materias)
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      const filteredIndices = filteredPersonal
        .map((tutor, index) => {
          const fullName = `${tutor.first_name} ${tutor.last_name}`.toLowerCase();
          const matchesName = fullName.includes(searchTermLower);
          const matchesSubjects = tutor.subjects?.some(subject => 
            subject.toLowerCase().includes(searchTermLower)
          );
          return (matchesName || matchesSubjects) ? index : -1;
        })
        .filter(index => index !== -1);

      filteredPersonal = filteredIndices.map(index => filteredPersonal[index]);
      filteredProfessional = filteredIndices.map(index => filteredProfessional[index]);
    }

    // Filtrar por ubicación
    if (this.selectedLocation !== 'default') {
      const selectedCity = this.locationMap[this.selectedLocation];
      if (selectedCity) {
        const locationFilteredIndices = filteredPersonal
          .map((tutor, index) => {
            const tutorLocation = tutor.location?.toLowerCase();
            return tutorLocation === selectedCity.toLowerCase() ? index : -1;
          })
          .filter(index => index !== -1);

        filteredPersonal = locationFilteredIndices.map(index => filteredPersonal[index]);
        filteredProfessional = locationFilteredIndices.map(index => filteredProfessional[index]);
      }
    }

    // Filtrar por nivel de educación
    if (this.selectedEducationLevel) {
      const educationFilteredIndices = filteredPersonal
        .map((tutor, index) => {
          const educationLevel = (tutor as any).education_level;
          return educationLevel === this.selectedEducationLevel ? index : -1;
        })
        .filter(index => index !== -1);

      filteredPersonal = educationFilteredIndices.map(index => filteredPersonal[index]);
      filteredProfessional = educationFilteredIndices.map(index => filteredProfessional[index]);
    }

    // Filtrar por rango de precios
    if (this.minPrice !== null || this.maxPrice !== null) {
      const priceFilteredIndices = filteredProfessional
        .map((tutor, index) => {
          const price = tutor.fee_per_hour;
          const meetsMinPrice = this.minPrice === null || price >= this.minPrice;
          const meetsMaxPrice = this.maxPrice === null || price <= this.maxPrice;
          return meetsMinPrice && meetsMaxPrice ? index : -1;
        })
        .filter(index => index !== -1);

      filteredPersonal = priceFilteredIndices.map(index => filteredPersonal[index]);
      filteredProfessional = priceFilteredIndices.map(index => filteredProfessional[index]);
    }

    // Filtrar por modalidad en línea
    if (this.isOnline) {
      const onlineFilteredIndices = filteredProfessional
        .map((tutor, index) => tutor.modality === 'virtual' ? index : -1)
        .filter(index => index !== -1);

      filteredPersonal = onlineFilteredIndices.map(index => filteredPersonal[index]);
      filteredProfessional = onlineFilteredIndices.map(index => filteredProfessional[index]);
    }

    this.filteredTutorsPersonal = filteredPersonal;
    this.filteredTutorsProfessional = filteredProfessional;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedLocation = 'default';
    this.selectedEducationLevel = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.isOnline = false;
    this.hasActiveFilters = false;
    this.filteredTutorsPersonal = [...this.tutorsPersonal];
    this.filteredTutorsProfessional = [...this.tutorsProfessional];
  }
}
