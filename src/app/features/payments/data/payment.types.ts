export type PaymentMethod = 'cash' | 'check' | 'bank_transfer' | 'credit_card';

export interface Payment {
  _id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
  recordedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentPayload {
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
}
