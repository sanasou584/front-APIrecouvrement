import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  apiBaseUrl: string;
  appName: string;
  tokenStorageKey: string;
}

export const APP_ENV = new InjectionToken<AppEnvironment>('APP_ENV', {
  factory: () => ({
    apiBaseUrl: 'http://localhost:5000/api',
    appName: 'Recouvra+',
    tokenStorageKey: 'recouvra_access_token'
  })
});