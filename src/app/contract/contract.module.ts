import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractRoutingModule } from './contract-routing.module';
import { ContractComponent } from './pages/contract/contract.component';
import { Browser } from 'protractor';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { ContractSelectCustomerComponent } from './pages/contract-select-customer/contract-select-customer.component';
import { ContractNewComponent } from './pages/contract-new/contract-new.component';
import { ContractFormComponent } from './partials/contract-form/contract-form.component';
import { ContractEditComponent } from './pages/contract-edit/contract-edit.component';
import { ContractProductCreateModalComponent } from './modals/contract-product-create-modal/contract-product-create-modal.component';
import { QuotingModule } from '../quoting/quoting.module';


@NgModule({
  declarations: [ContractComponent, ContractSelectCustomerComponent, ContractNewComponent, ContractFormComponent, ContractEditComponent, ContractProductCreateModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    QuotingModule,
    ContractRoutingModule
  ]
})
export class ContractModule { }
