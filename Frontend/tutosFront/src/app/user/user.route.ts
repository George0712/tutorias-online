import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';

export const UserRoutes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile-user.component'),
        canActivate: [authGuard]
      },
      {
        //rutas de estudiante
        path: 'student',
        children: [
          {
            path: 'details-tutor',
            loadComponent: () =>
              import('./student/detail-tutor/detail-tutor.component'),
          }
        ],
      },
      {
        //rutas de tutor
        path: 'tutor',
        children: [
          {
            path: 'mi-panel',
            loadComponent: () =>
              import('./tutor/home-panel/home-panel.component'),
            canActivate: [authGuard],
          },
          
        ],
      },
    ],
  },
];
