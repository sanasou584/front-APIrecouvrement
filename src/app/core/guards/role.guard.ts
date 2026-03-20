import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

import { APP_ROUTES } from '../constants/app.constants';
import { AuthStore } from '../store/auth.store';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const allowedRoles = (route.data['roles'] as string[] | undefined) ?? [];

  if (!authStore.isAuthenticated()) {
    return router.createUrlTree([APP_ROUTES.login]);
  }

  return allowedRoles.length === 0 || authStore.hasAnyRole(allowedRoles)
    ? true
    : router.createUrlTree([APP_ROUTES.dashboard]);
};