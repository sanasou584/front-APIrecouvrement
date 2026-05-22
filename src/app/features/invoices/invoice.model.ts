// Status enum matches backend server values
export type InvoiceStatus = 'pending' | 'partially_paid' | 'paid' | 'overdue';

// Mapping from server status to French display label
export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  'pending': 'En attente',
  'partially_paid': 'Partiellement payée',
  'paid': 'Payée',
  'overdue': 'En retard'
};

export interface Invoice {
  _id?: string;  // MongoDB native ID field
  id?: string;   // Alternative ID field
  invoiceNumber: string;
  clientId: string;
  clientName?: string;
  amount: number;
  dueDate: string; // ISO date
  status: InvoiceStatus;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  // optional history/timeline
  history?: InvoiceHistoryEntry[];
}

export interface InvoicePayload {
  invoiceNumber?: string;
  clientId: string;
  amount: number;
  dueDate: string;
  description?: string;
  status?: InvoiceStatus;
}

export interface InvoiceHistoryEntry {
  id?: string;
  status: InvoiceStatus;
  changedBy?: string;
  changedAt: string; // ISO date
  note?: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus | 'ALL';
  search?: string; // invoice number or client name
  page?: number;
  pageSize?: number;
}
