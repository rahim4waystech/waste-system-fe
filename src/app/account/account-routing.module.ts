import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { AccountsNewComponent } from './pages/accounts-new/accounts-new.component';
import { AccountEditComponent } from './pages/account-edit/account-edit.component';
import { AccountsSiteNewComponent } from './pages/accounts-site-new/accounts-site-new.component';
import { ForbiddenComponent } from '../core/pages/forbidden/forbidden.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SiteDeleteComponent } from './pages/site-delete/site-delete.component';


const routes: Routes = [
  {
    component: AccountsComponent,
    path: 'accounts',
    canActivate: [AuthGuard],
  },
  {
    component: AccountsNewComponent,
    path: 'accounts/new',
    canActivate: [AuthGuard],
  },
  {
    component: AccountEditComponent,
    path: 'accounts/edit/:id',
    canActivate: [AuthGuard],
  },
  {
    component: AccountsSiteNewComponent,
    path: 'accounts/site/:id',
    canActivate: [AuthGuard],
  },
  {
    component: SiteDeleteComponent,
    path: 'site/delete/:id',
    canActivate: [AuthGuard],
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
