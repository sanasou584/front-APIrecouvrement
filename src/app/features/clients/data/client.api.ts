import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENV } from '../../../core/config/env.token';
import type { ApiSuccessResponse } from '../../../core/types/api.types';
import type { Client, ClientPayload } from './client.types';

@Injectable({ providedIn: 'root' })
export class ClientApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENV);
  private readonly baseUrl = `${this.env.apiBaseUrl}/clients`;

  list(): Observable<ApiSuccessResponse<Client[]>> {
    return this.http.get<ApiSuccessResponse<Client[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiSuccessResponse<Client>> {
    return this.http.get<ApiSuccessResponse<Client>>(`${this.baseUrl}/${id}`);
  }

  create(payload: ClientPayload): Observable<ApiSuccessResponse<Client>> {
    return this.http.post<ApiSuccessResponse<Client>>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<ClientPayload>): Observable<ApiSuccessResponse<Client>> {
    return this.http.put<ApiSuccessResponse<Client>>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: string): Observable<ApiSuccessResponse<{ message?: string }>> {
    return this.http.delete<ApiSuccessResponse<{ message?: string }>>(`${this.baseUrl}/${id}`);
  }
}
