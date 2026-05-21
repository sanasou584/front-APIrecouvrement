import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import type { User, UserPayload } from '../data/user.types';

@Component({
  selector: 'app-adduser',
  imports: [ReactiveFormsModule],
  templateUrl: './adduser.html',
  styleUrl: './adduser.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Adduser {
  readonly user = input<User | null>(null);
  readonly saving = input(false);
  readonly close = output<void>();
  readonly submit = output<UserPayload>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();

    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.form.patchValue(currentUser);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['collector', Validators.required],
      isActive: [true],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Ne pas envoyer le mot de passe vide en cas de modification
      if (!this.user() || formValue.password) {
        this.submit.emit(formValue);
      } else {
        const { password, ...payload } = formValue;
        this.submit.emit(payload);
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
