import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENV } from '../config/env.token';
import type { ApiSuccessResponse } from '../types/api.types';
import type { AuthTokenResponse, AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENV);
  private readonly baseUrl = `${this.env.apiBaseUrl}/auth`;

  login(payload: LoginPayload): Observable<ApiSuccessResponse<AuthTokenResponse>> {
    return this.http.post<ApiSuccessResponse<AuthTokenResponse>>(`${this.baseUrl}/login`, payload);
  }

  register(payload: RegisterPayload): Observable<ApiSuccessResponse<AuthTokenResponse>> {
    return this.http.post<ApiSuccessResponse<AuthTokenResponse>>(`${this.baseUrl}/register`, payload);
  }

  me(): Observable<ApiSuccessResponse<AuthUser>> {
    return this.http.get<ApiSuccessResponse<AuthUser>>(`${this.baseUrl}/me`);
  }
}