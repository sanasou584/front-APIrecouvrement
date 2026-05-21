import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import type { Payment } from '../data/payment.types';

@Component({
  selector: 'app-payment-list',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentList {
  readonly payments = input.required<Payment[]>();
  readonly canDelete = input(false);
  readonly deleting = input(false);

  readonly remove = output<string>();
}
