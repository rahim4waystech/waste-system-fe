import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeighbridgeComponent } from './pages/weighbridge/weighbridge.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WeighbridgeYardTradeCustomerComponent } from './pages/weighbridge-yard-trade-customer/weighbridge-yard-trade-customer.component';
import { WeighbridgeYardTradeComponent } from './pages/weighbridge-yard-trade/weighbridge-yard-trade.component';
import { WeighbridgeYardTradeListComponent } from './pages/weighbridge-yard-trade-list/weighbridge-yard-trade-list.component';
import { WeighbridgeYardTradeEditComponent } from './pages/weighbridge-yard-trade-edit/weighbridge-yard-trade-edit.component';


const routes: Routes = [
  {
    path: 'weighbridge',
    component: WeighbridgeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'weighbridge/yard-trade',
    component: WeighbridgeYardTradeCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'weighbridge/yard-trade/list',
    component: WeighbridgeYardTradeListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'weighbridge/yard-trade/edit/:id',
    component: WeighbridgeYardTradeEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'weighbridge/yard-trade/:id',
    component: WeighbridgeYardTradeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeighbridgeRoutingModule { }
