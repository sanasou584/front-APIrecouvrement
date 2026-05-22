import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { ClientApiService } from '../../clients/data/client.api';
import type { Client } from '../../clients/data/client.types';
import { InvoiceService } from '../invoice.service';
import type { InvoicePayload } from '../invoice.model';
import { STATUS_LABELS } from '../invoice.model';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clientApi = inject(ClientApiService);
  private readonly invoiceService = inject(InvoiceService);

  readonly submit = output<InvoicePayload>();
  readonly close = output<void>();
  readonly minDueDate = this.toDateInputValue(new Date());

  readonly statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'partially_paid', label: 'Partiellement payée' },
    { value: 'paid', label: 'Payée' },
    { value: 'overdue', label: 'En retard' }
  ];

  // include invoiceNumber field to satisfy backends that require it
  readonly form = this.fb.nonNullable.group({
    invoiceNumber: [''],
    clientId: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    dueDate: ['', [Validators.required, this.notPastDateValidator()]],
    description: [''],
    status: ['pending', [Validators.required]]
  });

  readonly clients = signal<Client[]>([]);
  loadingClients = false;
  clientLoadError = '';
  serverErrors: string[] = [];
  serverMessage = '';

  constructor() {
    this.form.controls.dueDate.setValue(this.minDueDate);

    this.loadingClients = true;
    this.clientApi.list().subscribe({
      next: (r) => {
        this.clients.set(r.data ?? []);
        this.loadingClients = false;
      },
      error: (err) => {
        console.error('Failed to load clients', err);
        this.clientLoadError = 'Impossible de charger les clients pour le moment.';
        this.loadingClients = false;
      }
    });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    // validate client selection exists
    const selectedClientId = (raw as any).clientId as string;
    if (!selectedClientId || !this.clients().some((c) => c._id === selectedClientId)) {
      this.clientLoadError = 'Client sélectionné invalide.';
      return;
    }

    // convert dueDate to ISO string (server commonly expects full ISO)
    const dueDateRaw = (raw as any).dueDate;
    let dueDateIso: string | undefined = undefined;
    try {
      const d = new Date(dueDateRaw as string);
      if (!isNaN(d.getTime())) {
        dueDateIso = d.toISOString();
      } else {
        dueDateIso = (dueDateRaw as string) || undefined;
      }
    } catch {
      dueDateIso = (dueDateRaw as string) || undefined;
    }

    const payload: InvoicePayload = {
      invoiceNumber: (raw as any).invoiceNumber || undefined,
      clientId: selectedClientId,
      amount: Number((raw as any).amount),
      dueDate: dueDateIso ?? (raw as any).dueDate,
      description: (raw as any).description,
      status: (raw as any).status
    };

    this.serverErrors = [];
    this.serverMessage = '';

    console.log('Creating invoice payload', payload);
    this.invoiceService.create(payload).subscribe(() => {
      this.close.emit();
    }, (err: any) => {
      console.error('Failed to create invoice', err);
      if (err?.error) {
        const body = err.error;
        this.serverMessage = body.message ?? 'Erreur serveur';
        if (Array.isArray(body.errors)) {
          this.serverErrors = body.errors;
        } else if (body.errors && typeof body.errors === 'string') {
          this.serverErrors = [body.errors];
        }
        console.debug('Server error body:', body);
      } else {
        this.serverMessage = err.message ?? 'Erreur inconnue';
      }
    });
  }

  // trackBy removed — template uses direct track expressions on the @for loops

  isInvalid(controlName: 'clientId' | 'amount' | 'dueDate' | 'status'): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  private notPastDateValidator(): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const selected = new Date(`${value}T00:00:00`);
      const today = new Date();
      selected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return selected < today ? { pastDate: true } : null;
    };
  }

  private toDateInputValue(date: Date): string {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
  }
}
