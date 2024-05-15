import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotingComponent } from './pages/quoting/quoting.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductNewComponent } from './pages/product-new/product-new.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { QuoteCustomerComponent } from './pages/quote-customer/quote-customer.component';
import { QuoteSiteComponent } from './pages/quote-site/quote-site.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { QuoteNewComponent } from './pages/quote-new/quote-new.component';
import { QuoteEditComponent } from './pages/quote-edit/quote-edit.component';
import { QuoteAcceptComponent } from './pages/quote-accept/quote-accept.component';
import { QuoteDeclineComponent } from './pages/quote-decline/quote-decline.component';


const routes: Routes = [
  {
    path: 'quoting',
    component: QuotingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/products/new',
    component: ProductNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/products/edit/:id',
    component: ProductEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/new/accounts',
    component: QuoteCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/new/accounts/:id/sites',
    component: QuoteSiteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/new/accounts/:accountId/sites/:siteId',
    component: QuoteNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/accept/:id',
    component: QuoteAcceptComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/decline/:id',
    component: QuoteDeclineComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quoting/edit/:id',
    component: QuoteEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotingRoutingModule { }
