import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { APP_ROUTES } from '../../../core/constants/app.constants';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
   private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly authStore = inject(AuthStore);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['admin@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  });

  readonly isSubmitting = computed(() => this.authStore.loading());

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);

    this.authStore.login(this.form.getRawValue()).subscribe({
      next: () => {
        void this.router.navigateByUrl(APP_ROUTES.dashboard);
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message ?? 'Connexion impossible');
      }
    });
  }
}
