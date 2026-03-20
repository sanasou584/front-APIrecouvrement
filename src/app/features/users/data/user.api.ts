import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENV } from '../../../core/config/env.token';
import type { ApiSuccessResponse } from '../../../core/types/api.types';
import type { User, UserPayload } from './user.types';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENV);
  private readonly baseUrl = `${this.env.apiBaseUrl}/users`;

  list(): Observable<ApiSuccessResponse<User[]>> {
    return this.http.get<ApiSuccessResponse<User[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiSuccessResponse<User>> {
    return this.http.get<ApiSuccessResponse<User>>(`${this.baseUrl}/${id}`);
  }

  create(payload: UserPayload): Observable<ApiSuccessResponse<User>> {
    return this.http.post<ApiSuccessResponse<User>>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<UserPayload>): Observable<ApiSuccessResponse<User>> {
    return this.http.put<ApiSuccessResponse<User>>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: string): Observable<ApiSuccessResponse<{ message?: string }>> {
    return this.http.delete<ApiSuccessResponse<{ message?: string }>>(`${this.baseUrl}/${id}`);
  }
}
