import { inject, Injectable } from '@angular/core';

import { APP_ENV } from '../config/env.token';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly env = inject(APP_ENV);

  getToken(): string | null {
    return localStorage.getItem(this.env.tokenStorageKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.env.tokenStorageKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.env.tokenStorageKey);
  }
}