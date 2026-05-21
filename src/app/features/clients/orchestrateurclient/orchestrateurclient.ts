import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Addclient } from '../addclient/addclient';
import { Allclient } from '../allclient/allclient';
import { ClientStore } from '../data/client.store';
import type { Client, ClientPayload } from '../data/client.types';

@Component({
  selector: 'app-orchestrateurclient',
  imports: [FormsModule, Addclient, Allclient],
  providers: [ClientStore],

  templateUrl: './orchestrateurclient.html',
  styleUrl: './orchestrateurclient.css',
})
export class Orchestrateurclient {
  readonly store = inject(ClientStore);
  readonly isFormOpen = signal(false);
  readonly editingClient = signal<Client | null>(null);

  constructor() {
    this.store.load();
  }

  openCreate(): void {
    this.editingClient.set(null);
    this.isFormOpen.set(true);
    this.store.clearError();
  }

  openEdit(client: Client): void {
    if (!this.store.canManage()) {
      return;
    }

    this.editingClient.set(client);
    this.isFormOpen.set(true);
    this.store.clearError();
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingClient.set(null);
    this.store.clearError();
  }

  save(payload: ClientPayload): void {
    const current = this.editingClient();

    if (current) {
      this.store.update(current._id, payload, () => this.closeForm());
      return;
    }

    this.store.create(payload, () => this.closeForm());
  }

  remove(client: Client): void {
    if (!this.store.canDelete()) {
      return;
    }

    const confirmed = window.confirm(`Supprimer le client ${client.companyName} ?`);

    if (!confirmed) {
      return;
    }

    this.store.remove(client._id);
  }

}
