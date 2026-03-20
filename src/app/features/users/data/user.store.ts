import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { AuthStore } from '../../../core/store/auth.store';
import type { User, UserFilters, UserPayload } from './user.types';
import { UserApiService } from './user.api';

interface UserState {
  items: User[];
  selected: User | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  initialized: boolean;
  error: string | null;
  filters: UserFilters;
}

const initialState: UserState = {
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
export class UserStore {
  private readonly api = inject(UserApiService);
  private readonly authStore = inject(AuthStore);

  private readonly state = signal<UserState>(initialState);

  readonly items = computed(() => this.state().items);
  readonly selected = computed(() => this.state().selected);
  readonly loading = computed(() => this.state().loading);
  readonly saving = computed(() => this.state().saving);
  readonly deleting = computed(() => this.state().deleting);
  readonly initialized = computed(() => this.state().initialized);
  readonly error = computed(() => this.state().error);
  readonly filters = computed(() => this.state().filters);
  readonly canManage = computed(() => this.authStore.hasAnyRole(['admin']));
  readonly canDelete = computed(() => this.authStore.hasAnyRole(['admin']));

  readonly filteredItems = computed(() => {
    const term = this.state().filters.search.trim().toLowerCase();

    if (!term) {
      return this.state().items;
    }

    return this.state().items.filter((user) =>
      [user.name, user.email, user.phone, user.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
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
          this.patchState({ error: error?.error?.message ?? 'Chargement des utilisateurs impossible' });
        }
      });
  }

  loadById(id: string): void {
    this.patchState({ loading: true, error: null });

    this.api
      .getById(id)
      .pipe(finalize(() => this.patchState({ loading: false })))
      .subscribe({
        next: (response) => {
          this.patchState({ selected: response.data });
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Chargement impossible' });
        }
      });
  }

  create(payload: UserPayload, onSuccess?: () => void): void {
    this.patchState({ saving: true, error: null });

    this.api
      .create(payload)
      .pipe(finalize(() => this.patchState({ saving: false })))
      .subscribe({
        next: (response) => {
          this.patchState({
            items: [response.data, ...this.state().items]
          });
          onSuccess?.();
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Création impossible' });
        }
      });
  }

  update(id: string, payload: Partial<UserPayload>, onSuccess?: () => void): void {
    this.patchState({ saving: true, error: null });

    this.api
      .update(id, payload)
      .pipe(finalize(() => this.patchState({ saving: false })))
      .subscribe({
        next: (response) => {
          this.patchState({
            items: this.state().items.map(item => (item._id === id ? response.data : item))
          });
          onSuccess?.();
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Mise à jour impossible' });
        }
      });
  }

  remove(id: string): void {
    this.patchState({ deleting: true, error: null });

    this.api
      .remove(id)
      .pipe(finalize(() => this.patchState({ deleting: false })))
      .subscribe({
        next: () => {
          this.patchState({
            items: this.state().items.filter(item => item._id !== id)
          });
        },
        error: (error) => {
          this.patchState({ error: error?.error?.message ?? 'Suppression impossible' });
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

  clearError(): void {
    this.patchState({ error: null });
  }

  private patchState(patch: Partial<UserState>): void {
    this.state.update(current => ({ ...current, ...patch }));
  }
}
