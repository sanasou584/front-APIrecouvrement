import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENV } from '../../../core/config/env.token';
import type { ApiSuccessResponse } from '../../../core/types/api.types';
import type { Payment, PaymentPayload } from './payment.types';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENV);
  private readonly baseUrl = `${this.env.apiBaseUrl}/payments`;

  list(filters?: { invoiceId?: string; paymentMethod?: string; startDate?: string; endDate?: string }): Observable<ApiSuccessResponse<Payment[]>> {
    const params: Record<string, string> = {};

    if (filters?.invoiceId) {
      params['invoiceId'] = filters.invoiceId;
    }

    if (filters?.paymentMethod) {
      params['paymentMethod'] = filters.paymentMethod;
    }

    if (filters?.startDate) {
      params['startDate'] = filters.startDate;
    }

    if (filters?.endDate) {
      params['endDate'] = filters.endDate;
    }

    return this.http.get<ApiSuccessResponse<Payment[]>>(this.baseUrl, { params });
  }

  create(payload: PaymentPayload): Observable<ApiSuccessResponse<Payment>> {
    return this.http.post<ApiSuccessResponse<Payment>>(this.baseUrl, payload);
  }

  remove(id: string): Observable<ApiSuccessResponse<{ message?: string }>> {
    return this.http.delete<ApiSuccessResponse<{ message?: string }>>(`${this.baseUrl}/${id}`);
  }
}
