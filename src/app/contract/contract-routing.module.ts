import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractComponent } from './pages/contract/contract.component';
import { ContractSelectCustomerComponent } from './pages/contract-select-customer/contract-select-customer.component';
import { ContractNewComponent } from './pages/contract-new/contract-new.component';
import { ContractEditComponent } from './pages/contract-edit/contract-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'contracts',
    component: ContractComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contracts/new/customers',
    component: ContractSelectCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contracts/new/customers/:id',
    component: ContractNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contracts/edit/:id',
    component: ContractEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { }
