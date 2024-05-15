import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicFormsRoutingModule } from './public-forms-routing.module';
import { PublicNewCustomerComponent } from './pages/public-new-customer/public-new-customer.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PublicNewCustomerComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    PublicFormsRoutingModule
  ]
})
export class PublicFormsModule { }
