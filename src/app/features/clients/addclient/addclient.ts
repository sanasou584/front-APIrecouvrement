import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import type { Client, ClientPayload } from '../data/client.types';

@Component({
  selector: 'app-addclient',
  imports: [ReactiveFormsModule],
  templateUrl: './addclient.html',
  styleUrl: './addclient.css',
})
export class Addclient {
  private readonly fb = inject(FormBuilder);

  readonly client = input<Client | null>(null);
  readonly disabled = input(false);
  readonly submitLabel = input('Enregistrer');

  readonly submit = output<ClientPayload>();
  readonly cancel = output<void>();

  readonly form = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.minLength(2)]],
    contactName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    address: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor() {
    effect(() => {
      const currentClient = this.client();

      this.form.reset({
        companyName: currentClient?.companyName ?? '',
        contactName: currentClient?.contactName ?? '',
        email: currentClient?.email ?? '',
        phone: currentClient?.phone ?? '',
        address: currentClient?.address ?? ''
      });
    });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submit.emit(this.form.getRawValue());
  }
}
