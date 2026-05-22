import type { Invoice } from './invoice.model';

/**
 * Normalizes invoice data from backend response.
 * Ensures that the _id field is populated from various sources:
 * - MongoDB's native _id field
 * - id field as fallback
 * - invoiceNumber as last resort
 */
export function normalizeInvoice(rawInvoice: any): Invoice {
  const clientRef = rawInvoice.clientId;
  const populatedClient = typeof clientRef === 'object' && clientRef !== null ? clientRef : null;

  const normalized: Invoice = {
    ...rawInvoice,
    _id: rawInvoice._id || rawInvoice.id || rawInvoice.invoiceNumber,
    id: rawInvoice.id || rawInvoice._id,
    clientId: populatedClient?._id || populatedClient?.id || rawInvoice.clientId,
    clientName:
      rawInvoice.clientName || populatedClient?.companyName || populatedClient?.contactName,
  };

  // Debug logging
  if (!rawInvoice._id) {
    console.warn(
      `⚠️ [INVOICE NORMALIZE] Invoice missing _id field. Available fields: ${Object.keys(rawInvoice).join(', ')}`,
      rawInvoice,
    );
  }

  return normalized;
}

/**
 * Normalizes an array of invoices
 */
export function normalizeInvoices(invoices: any[]): Invoice[] {
  return invoices.map(normalizeInvoice);
}
