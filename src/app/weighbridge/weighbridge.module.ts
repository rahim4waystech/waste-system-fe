import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeighbridgeRoutingModule } from './weighbridge-routing.module';
import { WeighbridgeComponent } from './pages/weighbridge/weighbridge.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SetWeightModalComponent } from './modals/set-weight-modal/set-weight-modal.component';
import { WeighbridgeYardTradeComponent } from './pages/weighbridge-yard-trade/weighbridge-yard-trade.component';
import { WeighbridgeYardTradeCustomerComponent } from './pages/weighbridge-yard-trade-customer/weighbridge-yard-trade-customer.component';
import { WeighbridgeYardTradeListComponent } from './pages/weighbridge-yard-trade-list/weighbridge-yard-trade-list.component';
import { YardTradePricingAddModalComponent } from './modals/yard-trade-pricing-add-modal/yard-trade-pricing-add-modal.component';
import { WeighbridgeYardTradeEditComponent } from './pages/weighbridge-yard-trade-edit/weighbridge-yard-trade-edit.component';


@NgModule({
  declarations: [WeighbridgeComponent, SetWeightModalComponent, WeighbridgeYardTradeComponent, WeighbridgeYardTradeCustomerComponent, WeighbridgeYardTradeListComponent, YardTradePricingAddModalComponent, WeighbridgeYardTradeEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    WeighbridgeRoutingModule
  ]
})
export class WeighbridgeModule { }
