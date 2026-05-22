import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENV } from '../../../core/config/env.token';
import type { ApiSuccessResponse } from '../../../core/types/api.types';
import type { DashboardStats, RecoveryStats, TopDebtor } from './stats.types';

@Injectable({ providedIn: 'root' })
export class StatsApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENV);
  private readonly baseUrl = `${this.env.apiBaseUrl}/stats`;

  dashboard(): Observable<ApiSuccessResponse<DashboardStats>> {
    return this.http.get<ApiSuccessResponse<DashboardStats>>(`${this.baseUrl}/dashboard`);
  }

  recovery(filters?: {
    startDate?: string;
    endDate?: string;
  }): Observable<ApiSuccessResponse<RecoveryStats>> {
    const params: Record<string, string> = {};

    if (filters?.startDate) {
      params['startDate'] = filters.startDate;
    }

    if (filters?.endDate) {
      params['endDate'] = filters.endDate;
    }

    return this.http.get<ApiSuccessResponse<RecoveryStats>>(`${this.baseUrl}/recovery`, { params });
  }

  topDebtors(limit = 5): Observable<ApiSuccessResponse<TopDebtor[]>> {
    return this.http.get<ApiSuccessResponse<TopDebtor[]>>(`${this.baseUrl}/top-debtors`, {
      params: { limit: String(limit) },
    });
  }
}
