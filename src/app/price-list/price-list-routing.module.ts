import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PriceListEditComponent } from './pages/price-list-edit/price-list-edit.component';
import { PriceListNewComponent } from './pages/price-list-new/price-list-new.component';
import { PriceListComponent } from './pages/price-list/price-list.component';
import { PriceListAccountsComponent } from './partials/price-list-accounts/price-list-accounts.component';

const routes: Routes = [
  {
    path: 'price-list',
    component: PriceListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'price-list/new/accounts',
    component: PriceListAccountsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'price-list/new/account/:id',
    component: PriceListNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'price-list/edit/:id',
    component: PriceListEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceListRoutingModule { }
