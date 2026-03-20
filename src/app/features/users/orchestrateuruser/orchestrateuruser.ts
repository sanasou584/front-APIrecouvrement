import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Adduser } from '../adduser/adduser';
import { Alluser } from '../alluser/alluser';
import { UserStore } from '../data/user.store';
import type { User, UserPayload } from '../data/user.types';

@Component({
  selector: 'app-orchestrateuruser',
  imports: [FormsModule, Adduser, Alluser],
  providers: [UserStore],
  templateUrl: './orchestrateuruser.html',
  styleUrl: './orchestrateuruser.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orchestrateuruser {
  readonly store = inject(UserStore);
  readonly isFormOpen = signal(false);
  readonly editingUser = signal<User | null>(null);

  constructor() {
    this.store.load();
  }

  openCreate(): void {
    this.editingUser.set(null);
    this.isFormOpen.set(true);
    this.store.clearError();
  }

  openEdit(user: User): void {
    if (!this.store.canManage()) {
      return;
    }

    this.editingUser.set(user);
    this.isFormOpen.set(true);
    this.store.clearError();
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingUser.set(null);
    this.store.clearError();
  }

  save(payload: UserPayload): void {
    const current = this.editingUser();

    if (current) {
      this.store.update(current._id, payload, () => this.closeForm());
      return;
    }

    this.store.create(payload, () => this.closeForm());
  }

  remove(user: User): void {
    if (!this.store.canDelete()) {
      return;
    }

    const confirmed = window.confirm(`Supprimer l'utilisateur ${user.name} ?`);

    if (!confirmed) {
      return;
    }

    this.store.remove(user._id);
  }
}
