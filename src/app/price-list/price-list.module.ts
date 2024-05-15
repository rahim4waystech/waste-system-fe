import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceListRoutingModule } from './price-list-routing.module';
import { PriceListComponent } from './pages/price-list/price-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { PriceListAccountsComponent } from './partials/price-list-accounts/price-list-accounts.component';
import { PriceListFormComponent } from './partials/price-list-form/price-list-form.component';
import { PriceListNewComponent } from './pages/price-list-new/price-list-new.component';
import { PriceListEditComponent } from './pages/price-list-edit/price-list-edit.component';


@NgModule({
  declarations: [PriceListComponent, PriceListAccountsComponent, PriceListFormComponent, PriceListNewComponent, PriceListEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    PriceListRoutingModule
  ]
})
export class PriceListModule { }
