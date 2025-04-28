import { Routes } from '@angular/router';
import { AuthRoutes } from './auth/features/auth.routes';
import { UserRoutes } from './user/user.route';

export const routes: Routes = [
  ...AuthRoutes,
  ...UserRoutes,
  {
    path: '',
    redirectTo: 'auth/visitor',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/visitor',
  },
];

