import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { StatsApiService } from '../data/stats.api';
import type { RecoveryStats } from '../data/stats.types';

@Component({
  selector: 'app-recovery-stats',
  imports: [CommonModule, FormsModule],
  templateUrl: './recovery-stats.html',
  styleUrl: './recovery-stats.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryStatsComponent {
  private readonly statsApi = inject(StatsApiService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly stats = signal<RecoveryStats | null>(null);
  readonly startDate = signal('');
  readonly endDate = signal('');

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.statsApi
      .recovery({
        startDate: this.startDate() || undefined,
        endDate: this.endDate() || undefined,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.stats.set(response.data),
        error: (error) => {
          this.error.set(error?.error?.message ?? 'Chargement des statistiques impossible');
        },
      });
  }

  reset(): void {
    this.startDate.set('');
    this.endDate.set('');
    this.load();
  }
}
