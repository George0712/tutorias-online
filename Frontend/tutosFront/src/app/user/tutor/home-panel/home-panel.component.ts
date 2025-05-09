import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-home-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-panel.component.html',
  styleUrls: ['./home-panel.component.css']
})
export default class HomePanelComponent implements OnInit {
  userName: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserPersonalData().subscribe(
      (data) => {
        if (data) {
          this.userName = `${data.first_name} ${data.last_name}`;
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }
} 