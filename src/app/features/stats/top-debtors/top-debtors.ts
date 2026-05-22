import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { StatsApiService } from '../data/stats.api';
import type { TopDebtor } from '../data/stats.types';

@Component({
  selector: 'app-top-debtors',
  imports: [CommonModule, FormsModule],
  templateUrl: './top-debtors.html',
  styleUrl: './top-debtors.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopDebtorsComponent {
  private readonly statsApi = inject(StatsApiService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly debtors = signal<TopDebtor[]>([]);
  readonly limit = signal(5);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.statsApi
      .topDebtors(this.limit())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.debtors.set(response.data ?? []),
        error: (error) => {
          this.error.set(error?.error?.message ?? 'Chargement du classement impossible');
        },
      });
  }
}
