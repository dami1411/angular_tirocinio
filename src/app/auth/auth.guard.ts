import { CanActivateFn, Router, CanActivateChildFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
  }
  else {
  }
  return true;
  // return authService.isAuthenticated() ? true : router.navigate(['login']);
};

export const authGuardChild: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  //return authService.isRoleAdmin();
  //return sessionStorage.getItem('user');
  return authService.isRoleAdmin();
};