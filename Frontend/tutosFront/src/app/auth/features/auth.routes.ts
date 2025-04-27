import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

export const AuthRoutes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'visitor',
                loadComponent: () => import('./Visitor/visitor-page.component'),
            },
            {
                path: 'login',
                loadComponent: () => import('./sign-in/sign-in.component'),
            },
            {
                path: 'register/student',
                loadComponent: () => import('./sign-up/sign-up-student/sign-up-student.component'),
            },
            {
                path: 'register/tutor',
                loadComponent: () => import('./sign-up/sign-up-tutor/sign-up-tutor.component'),

            },
            {
                path: '',
                redirectTo: 'visitor',
                pathMatch: 'full',
            }
        ]
    }
];
