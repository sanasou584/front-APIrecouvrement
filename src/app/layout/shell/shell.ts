import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthStore } from '../../core/store/auth.store';


@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
    readonly authStore = inject(AuthStore);
  readonly canAccessUsers = computed(() => this.authStore.hasAnyRole(['admin', 'manager']));
  readonly pageTitle = computed(() => 'Tableau de bord');
}

