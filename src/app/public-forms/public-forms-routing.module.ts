import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicNewCustomerComponent } from './pages/public-new-customer/public-new-customer.component';


const routes: Routes = [
  {
    path: 'public/new/customer/:token',
    component: PublicNewCustomerComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicFormsRoutingModule { }
