import { RouterModule, Routes } from '@angular/router';
import { AuthRoutes } from './auth/features/auth.routes';
import { UserRoutes } from './user/user.route';

export const routes: Routes = [
  ...AuthRoutes,
  ...UserRoutes,
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];

