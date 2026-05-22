export interface DashboardStats {
  totals: {
    totalClients: number;
    totalInvoices: number;
    totalPayments: number;
    totalActions: number;
    totalInvoiced: number;
    totalPaid: number;
    remainingToCollect: number;
  };
  invoicesByStatus: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
  actionsByType: Array<{
    actionType: string;
    count: number;
  }>;
}

export interface RecoveryStats {
  period: {
    startDate?: string;
    endDate?: string;
  };
  metrics: {
    actionsCount: number;
    paymentsCount: number;
    totalRecovered: number;
    overdueInvoices: number;
  };
}

export interface TopDebtor {
  clientId: string;
  contactName: string;
  companyName: string;
  email: string;
  unpaidInvoicesCount: number;
  totalAmountDue: number;
}
