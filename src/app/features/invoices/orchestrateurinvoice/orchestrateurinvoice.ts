import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InvoiceList } from '../invoice-list/invoice-list';
import { InvoiceForm } from '../invoice-form/invoice-form';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-orchestrateurinvoice',
  imports: [CommonModule, FormsModule, InvoiceList, InvoiceForm],
  providers: [InvoiceService],
  templateUrl: './orchestrateurinvoice.html',
  styleUrl: './orchestrateurinvoice.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Orchestrateurinvoice {
  readonly service = inject(InvoiceService);
  readonly isFormOpen = signal(false);

  constructor() {
    this.service.loadList().subscribe();
  }

  openCreate(): void {
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.service.loadList().subscribe();
  }
}


