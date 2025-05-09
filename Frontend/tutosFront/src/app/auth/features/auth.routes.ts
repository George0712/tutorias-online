import { Routes } from '@angular/router';
import { visitorGuard } from '../guards/visitor.guard';

export const AuthRoutes: Routes = [
    {
        path: 'visitor',
        loadComponent: () => import('./Visitor/visitor-page.component'),
        canActivate: [visitorGuard]
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./sign-in/sign-in.component'),
                canActivate: [visitorGuard]
            },
            {
                path: 'register/student',
                loadComponent: () => import('./sign-up/sign-up-student/sign-up-student.component'),
                canActivate: [visitorGuard]
            },
            {
                path: 'register/tutor',
                loadComponent: () => import('./sign-up/sign-up-tutor/sign-up-tutor.component'),
                canActivate: [visitorGuard]
            }
        ]
    },
    {
        path: '',
        redirectTo: 'visitor',
        pathMatch: 'full',
    }
];
