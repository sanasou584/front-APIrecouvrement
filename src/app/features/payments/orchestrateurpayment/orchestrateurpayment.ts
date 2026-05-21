import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PaymentForm } from '../payment-form/payment-form';
import { PaymentList } from '../payment-list/payment-list';
import { PaymentStore } from '../data/payment.store';
import type { PaymentPayload } from '../data/payment.types';

@Component({
  selector: 'app-orchestrateurpayment',
  imports: [FormsModule, PaymentForm, PaymentList],
  providers: [PaymentStore],
  templateUrl: './orchestrateurpayment.html',
  styleUrl: './orchestrateurpayment.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Orchestrateurpayment {
  readonly store = inject(PaymentStore);
  readonly isFormOpen = signal(false);

  constructor() {
    this.store.load();
  }

  openCreate(): void {
    this.isFormOpen.set(true);
    this.store.clearError();
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.store.clearError();
  }

  save(payload: PaymentPayload): void {
    this.store.create(payload, () => this.closeForm());
  }

  remove(id: string): void {
    const confirmed = window.confirm('Supprimer ce paiement ?');

    if (!confirmed) {
      return;
    }

    this.store.remove(id);
  }
}
