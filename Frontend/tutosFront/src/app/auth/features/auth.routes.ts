import { Routes } from '@angular/router';

export const AuthRoutes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./sign-in/sign-in.component'),
            },
            {
                path: 'register/student',
                loadComponent: () => import('./sign-up/sign-up.component'),
            },
            {
                path: 'register/tutor',
                loadComponent: () => import('./sign-up-tutor/sign-up-tutor.component'),
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            }
        ]
    }
];
