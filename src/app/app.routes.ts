import { Allclient } from './features/clients/allclient/allclient';
import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { Shell } from './layout/shell/shell';
import { PlaceholderPage } from './shared/ui/placeholder-page/placeholder-page';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app/dashboard'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register)
  },
  {
    path: 'app',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/orchestrateurclient/orchestrateurclient').then((m) => m.Orchestrateurclient)
      },
      {
      path: 'clients/:id',
        loadComponent: () => import('./features/clients/detailsclient/detailsclient').then((m) => m.Detailsclient)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./features/invoices/orchestrateurinvoice/orchestrateurinvoice').then((m) => m.Orchestrateurinvoice)
      },
      {
        path: 'invoices/:id',
        loadComponent: () => import('./features/invoices/invoice-detail/invoice-detail').then((m) => m.InvoiceDetail)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/payments/orchestrateurpayment/orchestrateurpayment').then((m) => m.Orchestrateurpayment)
      },
      {
        path: 'actions',
        component: PlaceholderPage,
        data: {
          title: 'Actions',
          description: 'Timeline, filtres et suivi opérationnel du recouvrement.'
        }
      },
      {
        path: 'stats',
        children: [
          {
            path: 'recovery',
            component: PlaceholderPage,
            data: {
              title: 'Recovery Stats',
              description: 'Statistiques de recouvrement par période via /api/stats/recovery.'
            }
          },
          {
            path: 'top-debtors',
            component: PlaceholderPage,
            data: {
              title: 'Top Debtors',
              description: 'Classement des débiteurs les plus importants via /api/stats/top-debtors.'
            }
          }
        ]
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () => import('./features/users/orchestrateuruser/orchestrateuruser').then((m) => m.Orchestrateuruser)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'app/dashboard'
  }
];
