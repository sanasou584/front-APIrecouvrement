import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENV } from '../../core/config/env.token';
import type { ApiSuccessResponse } from '../../core/types/api.types';
import type { Invoice, InvoicePayload } from './invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENV);
  private readonly baseUrl = `${this.env.apiBaseUrl}/invoices`;

  list(filters?: { status?: string; search?: string }): Observable<ApiSuccessResponse<Invoice[]>> {
    const params: Record<string, string> = {};
    if (filters?.status && filters.status !== 'ALL') params['status'] = filters.status;
    if (filters?.search) params['search'] = filters.search;
    return this.http.get<ApiSuccessResponse<Invoice[]>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiSuccessResponse<Invoice>> {
    return this.http.get<ApiSuccessResponse<Invoice>>(`${this.baseUrl}/${id}`);
  }

  create(payload: InvoicePayload): Observable<ApiSuccessResponse<Invoice>> {
    return this.http.post<ApiSuccessResponse<Invoice>>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<InvoicePayload>): Observable<ApiSuccessResponse<Invoice>> {
    return this.http.patch<ApiSuccessResponse<Invoice>>(`${this.baseUrl}/${id}`, payload);
  }

  changeStatus(id: string, status: string): Observable<ApiSuccessResponse<Invoice>> {
    return this.http.patch<ApiSuccessResponse<Invoice>>(`${this.baseUrl}/${id}/status`, { status });
  }

  remove(id: string): Observable<ApiSuccessResponse<{ message?: string }>> {
    return this.http.delete<ApiSuccessResponse<{ message?: string }>>(`${this.baseUrl}/${id}`);
  }
}


