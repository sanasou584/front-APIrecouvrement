import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { APP_ROUTES } from '../../../core/constants/app.constants';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly authStore = inject(AuthStore);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  readonly isSubmitting = computed(() => this.authStore.loading());

  passwordMatchValidator(form: any): any {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);

    const { name, email, password } = this.form.getRawValue();

    this.authStore.register({ name, email, password }).subscribe({
      next: () => {
        void this.router.navigateByUrl(APP_ROUTES.dashboard);
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message ?? 'Inscription impossible');
      }
    });
  }
}
