import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { InvoiceService } from '../invoice.service';
import type { Invoice } from '../invoice.model';
import { STATUS_LABELS } from '../invoice.model';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent implements AfterViewInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly authStore = inject(AuthStore);
  private readonly invoicesSignal = toSignal(this.invoiceService.invoices$, {
    initialValue: [] as Invoice[],
  });
  private readonly loadingSignal = toSignal(this.invoiceService.loading$, { initialValue: false });

  readonly statuses = [
    { value: 'ALL', label: 'Tous' },
    { value: 'pending', label: 'En attente' },
    { value: 'paid', label: 'Payée' },
    { value: 'overdue', label: 'En retard' },
    { value: 'partially_paid', label: 'Partiellement payée' },
  ];

  readonly selectedStatus = signal<string>('ALL');
  readonly searchTerm = signal<string>('');
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly deleteError = signal<string | null>(null);

  readonly invoices = computed(() => this.invoicesSignal() ?? []);
  readonly loading = computed(() => this.loadingSignal());
  readonly canDelete = computed(() => this.authStore.hasAnyRole(['admin']));

  readonly filtered = computed(() => {
    const all = this.invoices();
    const s = this.searchTerm().trim().toLowerCase();
    const st = this.selectedStatus();
    let out = all;

    // Filter by status
    if (st && st !== 'ALL') {
      out = out.filter((i) => i.status === st);
    }

    // Search by invoice ID, invoice number, or client name
    if (s) {
      out = out.filter(
        (i) =>
          (i._id || i.id || '').toLowerCase().includes(s) ||
          (i.invoiceNumber ?? '').toLowerCase().includes(s) ||
          (i.clientName ?? '').toLowerCase().includes(s),
      );
    }

    return out;
  });

  readonly pages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));
  readonly currentPageItems = computed(() => {
    const p = this.page();
    const size = this.pageSize();
    return this.filtered().slice((p - 1) * size, p * size);
  });

  constructor() {
    this.loadInvoices();
  }

  setStatusFilter(v: string): void {
    this.selectedStatus.set(v);
    this.page.set(1);
    this.loadInvoices();
  }

  setSearch(v: string): void {
    this.searchTerm.set(v);
    this.page.set(1);
    this.loadInvoices();
  }

  setPageSize(v: number): void {
    this.pageSize.set(v);
    this.page.set(1);
  }

  prev(): void {
    if (this.page() > 1) this.page.update((n) => n - 1);
  }

  next(): void {
    if (this.page() < this.pages()) this.page.update((n) => n + 1);
  }

  deleteInvoice(invoice: Invoice): void {
    if (!this.canDelete()) {
      return;
    }

    const id = invoice._id || invoice.id;

    if (!id) {
      this.deleteError.set('ID facture introuvable.');
      return;
    }

    const confirmed = window.confirm('Supprimer cette facture ?');

    if (!confirmed) {
      return;
    }

    this.deleteError.set(null);
    this.invoiceService.remove(id).subscribe({
      error: (error) => {
        this.deleteError.set(error?.error?.message ?? 'Suppression de la facture impossible');
      },
    });
  }

  statusClass(status: string): string {
    return `status-${status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')}`;
  }

  private loadInvoices(): void {
    this.invoiceService
      .loadList({ status: this.selectedStatus() as any, search: this.searchTerm() })
      .subscribe();
  }

  ngAfterViewInit() {
    // Debug: Log rendered items to verify _id is present
    setTimeout(() => {
      const items = this.currentPageItems();
      if (items.length > 0) {
        console.log('✅ [INVOICE LIST] Rendered items:');
        console.log('  Count:', items.length);
        console.log('  First item _id:', items[0]._id);
        console.log('  First item id:', items[0].id);
        console.log('  Full first item:', items[0]);
      }
    }, 100);
  }

  // UI helpers
  statusLabel(status: string) {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
  }
}
