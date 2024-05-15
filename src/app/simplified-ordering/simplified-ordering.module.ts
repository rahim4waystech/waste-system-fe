import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimplifiedOrderingRoutingModule } from './simplified-ordering-routing.module';
import { SimplifiedOrderingFormComponent } from './partials/simplified-ordering-form/simplified-ordering-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { OrderModule } from '../order/order.module';
import { SimplifiedOrderingNewComponent } from './pages/simplified-ordering-new/simplified-ordering-new.component';
import { NgSelectConfig, NgSelectModule, ɵs } from '@ng-select/ng-select';


@NgModule({
  declarations: [SimplifiedOrderingFormComponent, SimplifiedOrderingNewComponent], 
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgSelectModule,
    CoreModule,
    OrderModule,
    SimplifiedOrderingRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ],
})
export class SimplifiedOrderingModule { }
