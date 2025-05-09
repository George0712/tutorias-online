import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-panel.component.html',
  styleUrls: ['./home-panel.component.css']
})
export default class HomePanelComponent implements OnInit {
  tutorName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
   
  }
} 