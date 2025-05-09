import { Routes } from '@angular/router';
import { AuthRoutes } from './auth/features/auth.routes';
import { UserRoutes } from './user/user.route';

export const routes: Routes = [
  ...AuthRoutes,
  ...UserRoutes,
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component'),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

