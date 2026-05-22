import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { InvoiceApiService } from '../../invoices/invoice.api';
import type { Invoice } from '../../invoices/invoice.model';
import type { PaymentPayload } from '../data/payment.types';

@Component({
  selector: 'app-payment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentForm {
  private readonly fb = inject(FormBuilder);
  private readonly invoiceApi = inject(InvoiceApiService);

  readonly payment = input<PaymentPayload | null>(null);
  readonly disabled = input(false);
  readonly submitLabel = input('Enregistrer le paiement');

  readonly submit = output<PaymentPayload>();
  readonly cancel = output<void>();

  readonly invoices = signal<Invoice[]>([]);
  readonly loadingInvoices = signal(false);
  readonly invoiceLoadError = signal<string | null>(null);
  readonly maxPaymentDate = new Date().toISOString().slice(0, 10);

  readonly form = this.fb.nonNullable.group({
    invoiceId: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    paymentDate: [this.maxPaymentDate, [Validators.required]],
    paymentMethod: ['cash', [Validators.required]],
    reference: [''],
    notes: [''],
  });

  constructor() {
    this.loadInvoices();

    effect(() => {
      const current = this.payment();

      this.form.reset({
        invoiceId: current?.invoiceId ?? '',
        amount: current?.amount ?? 0,
        paymentDate: current?.paymentDate ?? this.maxPaymentDate,
        paymentMethod: current?.paymentMethod ?? 'cash',
        reference: current?.reference ?? '',
        notes: current?.notes ?? '',
      });
    });
  }

  loadInvoices(): void {
    this.loadingInvoices.set(true);
    this.invoiceLoadError.set(null);

    this.invoiceApi.list().subscribe({
      next: (response) => {
        this.invoices.set(response.data ?? []);
        this.loadingInvoices.set(false);
      },
      error: (error) => {
        this.invoiceLoadError.set(error?.error?.message ?? 'Chargement des factures impossible');
        this.loadingInvoices.set(false);
      },
    });
  }

  invoiceId(invoice: Invoice): string {
    return invoice._id ?? invoice.id ?? '';
  }

  invoiceLabel(invoice: Invoice): string {
    const id = this.invoiceId(invoice);
    const client = this.invoiceClientName(invoice);
    const amount = Number(invoice.amount ?? 0).toFixed(2);

    return [id, client, `${amount}`].filter(Boolean).join(' - ');
  }

  isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submit.emit(this.form.getRawValue() as PaymentPayload);
  }

  private invoiceClientName(invoice: Invoice): string {
    const client = (
      invoice as unknown as { clientId?: string | { companyName?: string; contactName?: string } }
    ).clientId;

    if (typeof client === 'object' && client !== null) {
      return client.companyName ?? client.contactName ?? '';
    }

    return invoice.clientName ?? '';
  }
}
