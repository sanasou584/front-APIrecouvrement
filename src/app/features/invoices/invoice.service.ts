import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

import type { Invoice, InvoiceFilters, InvoicePayload } from './invoice.model';
import { InvoiceApiService } from './invoice.api';
import { normalizeInvoices } from './invoice.utils';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly api = inject(InvoiceApiService);

  private readonly invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  readonly invoices$ = this.invoicesSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  // load list from API
  loadList(filters?: InvoiceFilters): Observable<Invoice[]> {
    this.loadingSubject.next(true);
    return this.api.list({ status: filters?.status, search: filters?.search }).pipe(
      map((res) => {
        const rawInvoices = res.data ?? [];
        // Debug logging of raw response
        if (rawInvoices.length > 0) {
          console.log('🔍 [INVOICE SERVICE] Raw backend response:');
          console.log('  Item count:', rawInvoices.length);
          console.log('  First item fields:', Object.keys(rawInvoices[0]));
          console.log('  First item:', rawInvoices[0]);
        }
        // Normalize invoices to ensure _id is present
        const normalized = normalizeInvoices(rawInvoices);
        if (normalized.length > 0) {
          console.log('  After normalization, first item:', normalized[0]);
        }
        return normalized;
      }),
      tap((list) => this.invoicesSubject.next(list)),
      catchError((err) => {
        console.error('Failed to load invoices', err);
        return of([] as Invoice[]);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  getById(id: string): Observable<Invoice | null> {
    return this.api.getById(id).pipe(
      map((r) => r.data ? normalizeInvoices([r.data])[0] : null)
    );
  }

  create(payload: InvoicePayload): Observable<Invoice | null> {
    return this.api.create(payload).pipe(
      map((r) => r.data ? normalizeInvoices([r.data])[0] : null)
    );
  }

  update(id: string, payload: Partial<InvoicePayload>): Observable<Invoice | null> {
    return this.api.update(id, payload).pipe(
      map((r) => r.data ? normalizeInvoices([r.data])[0] : null)
    );
  }

  changeStatus(id: string, status: string): Observable<Invoice | null> {
    return this.api.changeStatus(id, status).pipe(
      map((r) => r.data ? normalizeInvoices([r.data])[0] : null)
    );
  }

  // convenience: current in-memory list
  get snapshot(): Invoice[] {
    return this.invoicesSubject.getValue();
  }
}

