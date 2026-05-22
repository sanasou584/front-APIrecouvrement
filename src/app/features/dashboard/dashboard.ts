import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { StatsApiService } from '../stats/data/stats.api';
import type { DashboardStats } from '../stats/data/stats.types';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly statsApi = inject(StatsApiService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly stats = signal<DashboardStats | null>(null);

  readonly totals = computed(() => this.stats()?.totals ?? null);
  readonly invoicesByStatus = computed(() => this.stats()?.invoicesByStatus ?? []);
  readonly actionsByType = computed(() => this.stats()?.actionsByType ?? []);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.statsApi
      .dashboard()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.stats.set(response.data),
        error: (error) => {
          this.error.set(error?.error?.message ?? 'Chargement des statistiques impossible');
        },
      });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      partially_paid: 'Partiellement payee',
      paid: 'Payee',
      overdue: 'En retard',
    };

    return labels[status] ?? status;
  }
}
