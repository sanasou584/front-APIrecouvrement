import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { AuthStore } from '../../../core/store/auth.store';
import type { Payment, PaymentPayload } from './payment.types';
import { PaymentApiService } from './payment.api';
import { getPaymentInvoiceId, normalizePayment, normalizePayments } from './payment.utils';

interface PaymentState {
  items: Payment[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  filters: {
    search: string;
  };
}

const initialState: PaymentState = {
  items: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  filters: {
    search: '',
  },
};

@Injectable()
export class PaymentStore {
  private readonly api = inject(PaymentApiService);
  private readonly authStore = inject(AuthStore);

  private readonly state = signal<PaymentState>(initialState);

  readonly items = computed(() => this.state().items);
  readonly loading = computed(() => this.state().loading);
  readonly saving = computed(() => this.state().saving);
  readonly deleting = computed(() => this.state().deleting);
  readonly error = computed(() => this.state().error);
  readonly filters = computed(() => this.state().filters);
  readonly canManage = computed(() => this.authStore.hasAnyRole(['admin', 'manager', 'agent']));
  readonly canDelete = computed(() => this.authStore.hasAnyRole(['admin', 'manager']));

  readonly filteredItems = computed(() => {
    const term = this.state().filters.search.trim().toLowerCase();

    if (!term) {
      return this.state().items;
    }

    return this.state().items.filter((payment) =>
      [
        getPaymentInvoiceId(payment),
        payment.paymentMethod,
        payment.reference,
        payment.notes,
        payment.invoiceStatus,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  });

  load(): void {
    this.patchState({ loading: true, error: null });

    this.api
      .list()
      .pipe(finalize(() => this.patchState({ loading: false })))
      .subscribe({
        next: (response) => {
          this.patchState({ items: normalizePayments(response.data ?? []) });
        },
        error: (error) => {
          this.patchState({
            error: error?.error?.message ?? 'Chargement des paiements impossible',
          });
        },
      });
  }

  create(payload: PaymentPayload, onSuccess?: (payment: Payment) => void): void {
    this.patchState({ saving: true, error: null });

    this.api
      .create(payload)
      .pipe(finalize(() => this.patchState({ saving: false })))
      .subscribe({
        next: (response) => {
          const payment = normalizePayment(response.data.payment);
          this.patchState({ items: [payment, ...this.state().items] });
          onSuccess?.(payment);
        },
        error: (error) => {
          this.patchState({
            error: error?.error?.message ?? 'Enregistrement du paiement impossible',
          });
        },
      });
  }

  remove(id: string): void {
    this.patchState({ deleting: true, error: null });

    this.api
      .remove(id)
      .pipe(finalize(() => this.patchState({ deleting: false })))
      .subscribe({
        next: () => {
          this.patchState({ items: this.state().items.filter((payment) => payment._id !== id) });
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Suppression du paiement impossible' });
        },
      });
  }

  setSearch(search: string): void {
    this.patchState({
      filters: {
        ...this.state().filters,
        search,
      },
    });
  }

  clearError(): void {
    this.patchState({ error: null });
  }

  private patchState(patch: Partial<PaymentState>): void {
    this.state.update((current) => ({ ...current, ...patch }));
  }
}
