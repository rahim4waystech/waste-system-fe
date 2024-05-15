import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { CoreModule } from '../core/core.module';
import { AccountsNewComponent } from './pages/accounts-new/accounts-new.component';
import { AccountsFormComponent } from './partials/accounts-form/accounts-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AccountEditComponent } from './pages/account-edit/account-edit.component';
import { AccountsSiteNewComponent } from './pages/accounts-site-new/accounts-site-new.component';
import { TippingPriceCreateModalComponent } from './modals/tipping-price-create-modal/tipping-price-create-modal.component';
import { ContactSectionComponent } from './partials/contact-section/contact-section.component';
import { LeadSectionComponent } from './partials/lead-section/lead-section.component';
import { OpportunitySectionComponent } from './partials/opportunity-section/opportunity-section.component';
import { ContractSectionComponent } from './partials/contract-section/contract-section.component';
import { SitesSectionComponent } from './partials/sites-section/sites-section.component';
import { ActiveAccountsComponent } from './partials/active-accounts/active-accounts.component';
import { InactiveAccountsComponent } from './partials/inactive-accounts/inactive-accounts.component';
import { ProspectsComponent } from './partials/prospects/prospects.component';
import { CorrespondenceModule } from '../correspondence/correspondence.module';
import { DepotSectionComponent } from './partials/depot-section/depot-section.component';
import { AllAccountsSectionComponent } from './partials/all-accounts-section/all-accounts-section.component';
import { TipsSectionComponent } from './partials/tips-section/tips-section.component';
import { NgSelectModule,NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import { AddCallbackModalComponent } from './modals/add-callback-modal/add-callback-modal.component';
import { PriceListSectionComponent } from './partials/price-list-section/price-list-section.component';
import { QuoteSectionComponent } from './partials/quote-section/quote-section.component';
import { OrderSectionComponent } from './partials/order-section/order-section.component';
import { SiteDeleteComponent } from './pages/site-delete/site-delete.component';


@NgModule({
  declarations: [AccountsComponent, AccountsNewComponent, AccountsFormComponent, AccountEditComponent, AccountsSiteNewComponent, TippingPriceCreateModalComponent, ContactSectionComponent, LeadSectionComponent, OpportunitySectionComponent, ContractSectionComponent, SitesSectionComponent, ActiveAccountsComponent, InactiveAccountsComponent, ProspectsComponent, DepotSectionComponent, AllAccountsSectionComponent, TipsSectionComponent, AddCallbackModalComponent, PriceListSectionComponent, QuoteSectionComponent, OrderSectionComponent, SiteDeleteComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgSelectModule,
    CoreModule,
    CorrespondenceModule,
    AccountRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ],
  exports: [
    AccountsNewComponent,
    AccountsSiteNewComponent,
  ]
})
export class AccountModule { }
