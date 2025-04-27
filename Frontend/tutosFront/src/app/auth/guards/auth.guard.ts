import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const expectedRole = route.data['expectedRole'] as string; // "student" o "tutor"
    const role = this.authService.getRole();

    if (role && role === expectedRole) {
      return true;
    } else {
      // Si no tiene el rol correcto, puede redirigirlo donde quieras
      return this.router.createUrlTree(['/unauthorized']);
    }
  }
}