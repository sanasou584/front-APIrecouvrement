export const APP_ROUTES = {
  login: '/login',
  register: '/register',
  app: '/app',
  dashboard: '/app/dashboard',
  clients: '/app/clients',
  invoices: '/app/invoices',
  payments: '/app/payments',
  actions: '/app/actions',
  users: '/app/users',
  recoveryStats: '/app/stats/recovery',
  topDebtors: '/app/stats/top-debtors'
} as const;

export const USER_ROLES = ['agent', 'manager', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];