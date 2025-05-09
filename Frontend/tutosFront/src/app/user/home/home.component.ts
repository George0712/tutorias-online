import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CardTutorComponent } from '../../shared/components/Cards/CardTutor/cardtutor.component';
import { TutorService, Tutor } from '../../services/tutor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardTutorComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent implements OnInit {
  tutors: Tutor[] = [];
  loading = false;
  searchTerm: string = '';
  selectedLocation: string = 'default';
  selectedEducationLevel: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  isOnline: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Prevenir la recarga si ya estamos en home
    if (this.router.url === '/') {
      this.router.navigate(['/'], { skipLocationChange: true });
    }
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      console.log('Búsqueda:', this.searchTerm, 'Ubicación:', this.selectedLocation);
    }
  }

  onLocationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLocation = select.value;
  }
}
