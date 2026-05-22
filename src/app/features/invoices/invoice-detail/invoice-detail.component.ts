import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { InvoiceService } from '../invoice.service';
import { PaymentApiService } from '../../payments/data/payment.api';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly invoiceService = inject(InvoiceService);
  private readonly paymentApi = inject(PaymentApiService);

  id = this.route.snapshot.paramMap.get('id') ?? '';

  invoice$ = this.invoiceService.getById(this.id);
  payments$ = this.paymentApi.list({ invoiceId: this.id });

  changeStatus(newStatus: string): void {
    const confirmed = window.confirm('Confirmer le changement de statut ?');
    if (!confirmed) return;

    this.invoiceService.changeStatus(this.id, newStatus).subscribe(() => {
      this.invoice$ = this.invoiceService.getById(this.id);
      // reload list cache
      this.invoiceService.loadList().subscribe();
    });
  }
}

