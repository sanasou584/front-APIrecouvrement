import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, tap, throwError } from 'rxjs';

import { APP_ROUTES } from '../constants/app.constants';
import { AuthApiService } from '../services/auth-api.service';
import { StorageService } from '../services/storage.service';
import type { AuthState, LoginPayload, RegisterPayload, AuthUser } from '../types/auth.types';

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  initialized: false
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authApi = inject(AuthApiService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly state = signal<AuthState>({
    ...initialState,
    token: this.storage.getToken()
  });

  readonly token = computed(() => this.state().token);
  readonly user = computed(() => this.state().user);
  readonly loading = computed(() => this.state().loading);
  readonly initialized = computed(() => this.state().initialized);
  readonly isAuthenticated = computed(() => Boolean(this.state().token && this.state().user));
  readonly role = computed(() => this.state().user?.role ?? null);

  init(): Observable<AuthUser | null> {
    const token = this.storage.getToken();

    if (!token) {
      this.patchState({ initialized: true, token: null, user: null });
      return of(null);
    }

    this.patchState({ loading: true, token });

    return this.authApi.me().pipe(
      map((response) => response.data),
      tap((user) => {
        this.patchState({ user, initialized: true });
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
      finalize(() => this.patchState({ loading: false }))
    );
  }

  login(payload: LoginPayload): Observable<AuthUser> {
    this.patchState({ loading: true });

    return this.authApi.login(payload).pipe(
      map((response) => response.data),
      tap(({ token, user }) => {
        this.storage.setToken(token);
        this.patchState({ token, user, initialized: true });
      }),
      map(({ user }) => user),
      finalize(() => this.patchState({ loading: false }))
    );
  }

  register(payload: RegisterPayload): Observable<AuthUser> {
    this.patchState({ loading: true });

    return this.authApi.register(payload).pipe(
      map((response) => response.data),
      tap(({ token, user }) => {
        this.storage.setToken(token);
        this.patchState({ token, user, initialized: true });
      }),
      map(({ user }) => user),
      finalize(() => this.patchState({ loading: false }))
    );
  }

  logout(): void {
    this.clearSession();
    void this.router.navigateByUrl(APP_ROUTES.login);
  }

  hasAnyRole(roles: readonly string[]): boolean {
    const currentRole = this.role();
    return !!currentRole && roles.includes(currentRole);
  }

  private clearSession(): void {
    this.storage.clearToken();
    this.state.set({ ...initialState, initialized: true });
  }

  private patchState(patch: Partial<AuthState>): void {
    this.state.update((current) => ({ ...current, ...patch }));
  }
}
