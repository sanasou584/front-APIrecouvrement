import type { Payment, PaymentInvoiceRef } from './payment.types';

function isInvoiceRef(value: unknown): value is PaymentInvoiceRef {
  return typeof value === 'object' && value !== null;
}

export function getPaymentInvoiceId(payment: Payment): string {
  const invoice = payment.invoiceId;

  if (isInvoiceRef(invoice)) {
    return invoice._id ?? invoice.id ?? '';
  }

  return invoice;
}

export function normalizePayment(rawPayment: Payment): Payment {
  const invoice = rawPayment.invoiceId;
  const invoiceRef = isInvoiceRef(invoice) ? invoice : null;
  const invoiceDisplayId =
    invoiceRef?._id ?? invoiceRef?.id ?? (typeof invoice === 'string' ? invoice : '');

  return {
    ...rawPayment,
    _id: rawPayment._id || (rawPayment as Payment & { id?: string }).id || invoiceDisplayId,
    invoiceDisplayId,
    invoiceAmount: invoiceRef?.amount,
    invoiceDueDate: invoiceRef?.dueDate,
    invoiceStatus: invoiceRef?.status,
  };
}

export function normalizePayments(payments: Payment[]): Payment[] {
  return payments.map(normalizePayment);
}
