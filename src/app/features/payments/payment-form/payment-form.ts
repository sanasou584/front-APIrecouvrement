import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import type { PaymentPayload } from '../data/payment.types';

@Component({
  selector: 'app-payment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentForm {
  private readonly fb = inject(FormBuilder);

  readonly payment = input<PaymentPayload | null>(null);
  readonly disabled = input(false);
  readonly submitLabel = input('Enregistrer le paiement');

  readonly submit = output<PaymentPayload>();
  readonly cancel = output<void>();

  readonly form = this.fb.nonNullable.group({
    invoiceId: ['', [Validators.required, Validators.minLength(5)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    paymentDate: ['', [Validators.required]],
    paymentMethod: ['cash', [Validators.required]],
    reference: [''],
    notes: ['']
  });

  constructor() {
    effect(() => {
      const current = this.payment();

      this.form.reset({
        invoiceId: current?.invoiceId ?? '',
        amount: current?.amount ?? 0,
        paymentDate: current?.paymentDate ?? new Date().toISOString().slice(0, 10),
        paymentMethod: current?.paymentMethod ?? 'cash',
        reference: current?.reference ?? '',
        notes: current?.notes ?? ''
      });
    });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submit.emit(this.form.getRawValue() as PaymentPayload);
  }
}
