import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map } from 'rxjs';

import { APP_ROUTES } from '../constants/app.constants';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = (): boolean | UrlTree | import('rxjs').Observable<boolean | UrlTree> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const resolve = (isAuthed: boolean) => (isAuthed ? true : router.createUrlTree([APP_ROUTES.login]));

  if (!authStore.initialized()) {
    return authStore.init().pipe(map((user) => resolve(!!user)));
  }

  return resolve(authStore.isAuthenticated());
};