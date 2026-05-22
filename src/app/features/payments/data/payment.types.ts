export type PaymentMethod = 'cash' | 'check' | 'bank_transfer' | 'credit_card';

export interface PaymentInvoiceRef {
  _id?: string;
  id?: string;
  amount?: number;
  dueDate?: string;
  status?: string;
}

export interface PaymentUserRef {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
}

export interface Payment {
  _id: string;
  invoiceId: string | PaymentInvoiceRef;
  invoiceDisplayId?: string;
  invoiceAmount?: number;
  invoiceDueDate?: string;
  invoiceStatus?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
  recordedBy?: string | PaymentUserRef;
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

export interface PaymentCreateResult {
  payment: Payment;
  invoice?: PaymentInvoiceRef & {
    totalPaid?: number;
    remainingAmount?: number;
  };
}
