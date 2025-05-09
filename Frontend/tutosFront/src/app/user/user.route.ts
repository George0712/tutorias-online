import { Routes } from '@angular/router';

export const UserRoutes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: 'form-personal-data',
        loadComponent: () =>
          import('./tutor/form-personal-data/form-personal-data.component'),
      },
      {
        //rutas de estudiante
        path: 'student',
        children: [
          {
            path: 'home-student',
            loadComponent: () =>
              import('./student/home_student/home-student.component'),
          },
          {
            path: 'details-tutor',
            loadComponent: () =>
              import('./student/detail-tutor/detail-tutor.component'),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./student/Profile/profileStudent.component'),
          },
        ],
      },
      {
        //rutas de tutor
        path: 'tutor',
        children: [
          {
            path: 'profile',
            loadComponent: () =>
              import('./tutor/profile/profile-tutor.component'),
          },
          {
            path: 'form-aditional-data',
            loadComponent: () =>
              import(
                './tutor/form-aditional-data/form-aditional-data.component'
              ),
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
