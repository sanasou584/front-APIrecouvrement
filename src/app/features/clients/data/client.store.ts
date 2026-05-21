import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { AuthStore } from '../../../core/store/auth.store';
import type { Client, ClientFilters, ClientPayload } from './client.types';
import { ClientApiService } from './client.api';

interface ClientState {
  items: Client[];
  selected: Client | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  initialized: boolean;
  error: string | null;
  filters: ClientFilters;
}

const initialState: ClientState = {
  items: [],
  selected: null,
  loading: false,
  saving: false,
  deleting: false,
  initialized: false,
  error: null,
  filters: {
    search: ''
  }
};

@Injectable()
export class ClientStore {
  private readonly api = inject(ClientApiService);
  private readonly authStore = inject(AuthStore);

  private readonly state = signal<ClientState>(initialState);

  readonly items = computed(() => this.state().items);
  readonly selected = computed(() => this.state().selected);
  readonly loading = computed(() => this.state().loading);
  readonly saving = computed(() => this.state().saving);
  readonly deleting = computed(() => this.state().deleting);
  readonly initialized = computed(() => this.state().initialized);
  readonly error = computed(() => this.state().error);
  readonly filters = computed(() => this.state().filters);
  readonly canManage = computed(() => this.authStore.hasAnyRole(['admin', 'manager']));
  readonly canDelete = computed(() => this.authStore.hasAnyRole(['admin']));

  readonly filteredItems = computed(() => {
    const term = this.state().filters.search.trim().toLowerCase();

    if (!term) {
      return this.state().items;
    }

    return this.state().items.filter((client) =>
      [client.companyName, client.contactName, client.email, client.phone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  });

  load(): void {
    this.patchState({ loading: true, error: null });

    this.api
      .list()
      .pipe(finalize(() => this.patchState({ loading: false, initialized: true })))
      .subscribe({
        next: (response) => {
          this.patchState({ items: response.data });
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Chargement des clients impossible' });
        }
      });
  }

  loadById(id: string): void {
    this.patchState({ loading: true, error: null, selected: null });

    this.api
      .getById(id)
      .pipe(finalize(() => this.patchState({ loading: false })))
      .subscribe({
        next: (response) => {
          this.patchState({ selected: response.data });
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Chargement du client impossible' });
        }
      });
  }

  create(payload: ClientPayload, onSuccess?: (client: Client) => void): void {
    this.patchState({ saving: true, error: null });

    this.api
      .create(payload)
      .pipe(finalize(() => this.patchState({ saving: false })))
      .subscribe({
        next: (response) => {
          const client = response.data;
          this.patchState({ items: [client, ...this.state().items] });
          onSuccess?.(client);
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Création du client impossible' });
        }
      });
  }

  update(id: string, payload: Partial<ClientPayload>, onSuccess?: (client: Client) => void): void {
    this.patchState({ saving: true, error: null });

    this.api
      .update(id, payload)
      .pipe(finalize(() => this.patchState({ saving: false })))
      .subscribe({
        next: (response) => {
          const updated = response.data;
          this.patchState({
            items: this.state().items.map((item) => (item._id === updated._id ? updated : item)),
            selected: this.state().selected?._id === updated._id ? updated : this.state().selected
          });
          onSuccess?.(updated);
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Mise à jour du client impossible' });
        }
      });
  }

  remove(id: string, onSuccess?: () => void): void {
    this.patchState({ deleting: true, error: null });

    this.api
      .remove(id)
      .pipe(finalize(() => this.patchState({ deleting: false })))
      .subscribe({
        next: () => {
          this.patchState({
            items: this.state().items.filter((item) => item._id !== id),
            selected: this.state().selected?._id === id ? null : this.state().selected
          });
          onSuccess?.();
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Suppression du client impossible' });
        }
      });
  }

  setSearch(search: string): void {
    this.patchState({
      filters: {
        ...this.state().filters,
        search
      }
    });
  }

  clearSelected(): void {
    this.patchState({ selected: null });
  }

  clearError(): void {
    this.patchState({ error: null });
  }

  private patchState(patch: Partial<ClientState>): void {
    this.state.update((state) => ({ ...state, ...patch }));
  }
}
