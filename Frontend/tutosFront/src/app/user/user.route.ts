import { Routes } from '@angular/router';

export const UserRoutes: Routes = [
    {
        path: 'user',
        children: [
            {
                path: 'details-tutor/student',
                loadComponent: () => import('./student/DetailTutor/detailtutor.component'),
            },
            {
                path: 'profile/student',
                loadComponent: () => import('./student/Profile/profileStudent.component'),
            },
            {
                path: 'profile/tutor',
                loadComponent: () => import('./tutor/Profile/profileTutor.component'),
            }
        ]

    }
];

