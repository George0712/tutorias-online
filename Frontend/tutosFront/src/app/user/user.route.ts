import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';

export const UserRoutes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: 'form-personal-data',
        loadComponent: () =>
          import('./form-personal-data/form-personal-data.component'),
        canActivate: [authGuard]
      },
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
          {
            path: 'form-aditional-data',
            loadComponent: () =>
              import(
                './tutor/form-aditional-data/form-aditional-data.component'
              ),
            canActivate: [authGuard],
            children: [
              {
                path: 'form-education-data',
                loadComponent: () =>
                  import(
                    './tutor/form-aditional-data/modals-form-aditional/modal-education/modal-education.component'
                  ),
                outlet: 'modal',
              },
              {
                path: 'form-skills-data',
                loadComponent: () =>
                  import(
                    './tutor/form-aditional-data/modals-form-aditional/modal-skills/modal-skills.component'
                  ),
                outlet: 'modal',
              },
              {
                path: 'form-language-data',
                loadComponent: () =>
                  import(
                    './tutor/form-aditional-data/modals-form-aditional/modal-languaje/modal-languaje.component'
                  ),
                outlet: 'modal',
              },
            ],
          },
        ],
      },
    ],
  },
];
