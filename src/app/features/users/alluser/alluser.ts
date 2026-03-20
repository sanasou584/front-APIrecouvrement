import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { User } from '../data/user.types';

@Component({
  selector: 'app-alluser',
  imports: [RouterLink],
  templateUrl: './alluser.html',
  styleUrl: './alluser.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alluser {
  readonly users = input.required<User[]>();
  readonly canManage = input(false);
  readonly canDelete = input(false);

  readonly edit = output<User>();
  readonly remove = output<User>();

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'admin': 'Admin',
      'manager': 'Manager',
      'collector': 'Collecteur',
      'viewer': 'Lecteur'
    };
    return labels[role] || role;
  }
}
