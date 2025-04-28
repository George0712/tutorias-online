import { Routes } from '@angular/router';

export const UserRoutes: Routes = [
    {
        path: 'user',
        children: [
            {
                path: 'student/details-tutor',
                loadComponent: () => import('./student/DetailTutor/detailtutor.component'),
            },
            {
                path: 'student/profile',
                loadComponent: () => import('./student/Profile/profileStudent.component'),
            },
            {
                path: 'tutor/profile',
                loadComponent: () => import('./tutor/Profile/profileTutor.component'),
            },
            {
                path: 'tutor/form-personal-data',
                loadComponent: () => import('./tutor/FormPersonalData/formpersonaldata.component'),
            },
            {
                path: 'tutor/form-aditional-data',
                loadComponent: () => import('./tutor/FormAditionalData/formaditionaldata.component'),
            }
        ]

    }
];

