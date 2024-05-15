import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderAcceptComponent } from './pages/order-accept/order-accept.component';
import { OrderAccountsComponent } from './pages/order-accounts/order-accounts.component';
import { OrderSitesComponent } from './pages/order-sites/order-sites.component';
import { OrderNewComponent } from './pages/order-new/order-new.component';
import { OrderEditComponent } from './pages/order-edit/order-edit.component';
import { OrderCopyComponent } from './pages/order-copy/order-copy.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OrderDeclineComponent } from './pages/order-decline/order-decline.component';

import { OrderQuickAccountsComponent } from './pages/order-quick-accounts/order-quick-accounts.component';
import { OrderQuickSiteComponent } from './pages/order-quick-site/order-quick-site.component';
import { OrderQuickComponent } from './pages/order-quick/order-quick.component';

import { OrderSimpleAccountsComponent } from './pages/order-simple-accounts/order-simple-accounts.component';
import { OrderSimpleSiteComponent } from './pages/order-simple-site/order-simple-site.component';
import { OrderSimpleComponent } from './pages/order-simple/order-simple.component';

import { OrderEditAccountsComponent } from './pages/order-edit-accounts/order-edit-accounts.component';
import { OrderEditSitesComponent } from './pages/order-edit-sites/order-edit-sites.component';
import { OrderCompleteComponent } from './pages/order-complete/order-complete.component';
import { OrderCopyAccountsComponent } from './pages/order-copy-accounts/order-copy-accounts.component';
import { OrderCopySitesComponent } from './pages/order-copy-sites/order-copy-sites.component';
import { OrderCsvToJsonComponent } from './pages/order-csv-to-json/order-csv-to-json.component';
import { OrdersArticComponent } from './pages/orders-artic/orders-artic.component';

const routes: Routes = [
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dataupload',
    component: OrderCsvToJsonComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/artics',
    component: OrdersArticComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/edit/:id',
    component: OrderEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/accept/:id',
    component: OrderAcceptComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/complete/:id',
    component: OrderCompleteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/new/accounts',
    component: OrderAccountsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/new/accounts/:id/sites',
    component: OrderSitesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/change/:id/accounts',
    component: OrderEditAccountsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/change/:id/accounts/:accountId/sites',
    component: OrderEditSitesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/copy/change/:id/accounts',
    component: OrderCopyAccountsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/copy/change/:id/accounts/:accountId/sites',
    component: OrderCopySitesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/new/accounts/:accountId/sites/:siteId',
    component: OrderNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/quick/new/accounts/:accountId/sites/:siteId',
    component: OrderQuickComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/quick/new/accounts',
    component: OrderQuickAccountsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/quick/new/accounts/:id/sites',
    component: OrderQuickSiteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/simple/new/accounts/',
    component: OrderSimpleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/simple/new/accounts',
    component: OrderSimpleAccountsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/simple/new/accounts/:accountId/sites/:siteId',
    component: OrderSimpleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/simple/new/accounts/:id/sites',
    component: OrderSimpleSiteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/simple/new',
    component: OrderSimpleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/copy/:id/:accountId/:siteId',
    component: OrderCopyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/copy/:id',
    component: OrderCopyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/decline/:id',
    component: OrderDeclineComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
