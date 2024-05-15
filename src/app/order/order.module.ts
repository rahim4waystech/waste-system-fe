import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrdersComponent } from './pages/orders/orders.component';
import { CoreModule } from '../core/core.module';
import { OrderAcceptComponent } from './pages/order-accept/order-accept.component';
import { OrderAccountsComponent } from './pages/order-accounts/order-accounts.component';
import { OrderSitesComponent } from './pages/order-sites/order-sites.component';
import { OrderNewComponent } from './pages/order-new/order-new.component';
import { OrderFormComponent } from './partials/order-form/order-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { OrderEditComponent } from './pages/order-edit/order-edit.component';
import { OrderCopyComponent } from './pages/order-copy/order-copy.component';
import { OrderDeclineComponent } from './pages/order-decline/order-decline.component';
import { OrderQuickAccountsComponent } from './pages/order-quick-accounts/order-quick-accounts.component';
import { OrderQuickSiteComponent } from './pages/order-quick-site/order-quick-site.component';
import { OrderQuickFormComponent } from './partials/order-quick-form/order-quick-form.component';
import { OrderQuickComponent } from './pages/order-quick/order-quick.component';


import { OrderSimpleAccountsComponent } from './pages/order-simple-accounts/order-simple-accounts.component';
import { OrderSimpleSiteComponent } from './pages/order-simple-site/order-simple-site.component';
import { OrderSimpleFormComponent } from './partials/order-simple-form/order-simple-form.component';
import { OrderSimpleComponent } from './pages/order-simple/order-simple.component';

import { QuotingModule } from '../quoting/quoting.module';
import { OrderPriceListCustomItemModalComponent } from './modals/order-price-list-custom-item-modal/order-price-list-custom-item-modal.component';
import { OrderPriceListAddItemComponent } from './modals/order-price-list-add-item/order-price-list-add-item.component';
import { NgSelectModule, NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import { OrderEditAccountsComponent } from './pages/order-edit-accounts/order-edit-accounts.component';
import { OrderEditSitesComponent } from './pages/order-edit-sites/order-edit-sites.component';
import { OrderMaterialUpliftComponent } from './modals/order-material-uplift/order-material-uplift.component';
import { OrderCompleteComponent } from './pages/order-complete/order-complete.component';
import { OrderAddGradeComponent } from './modals/order-add-grade/order-add-grade.component';
import { OrderAddAccountComponent } from './modals/order-add-account/order-add-account.component';
import { OrderQuickAddAccountComponent } from './modals/order-quick-add-account/order-quick-add-account.component';
import { AccountModule } from '../account/account.module';
import { OrderAddSiteComponent } from './modals/order-add-site/order-add-site.component';
import { OrderCopyAccountsComponent } from './pages/order-copy-accounts/order-copy-accounts.component';
import { OrderCopySitesComponent } from './pages/order-copy-sites/order-copy-sites.component';
import { OrdersArticComponent } from './pages/orders-artic/orders-artic.component';
import { OrderCsvToJsonComponent } from './pages/order-csv-to-json/order-csv-to-json.component';

/**
 * 
 * <app-order-price-list-custom-item-modal></app-order-price-list-custom-item-modal>
<app-order-add-grade></app-order-add-grade>
<app-order-material-uplift></app-order-material-uplift>
<app-order-price-list-add-item [account]='this.account' [site]='this.site'></app-order-price-list-add-item>
  

 */
@NgModule({
  declarations: [OrdersComponent, OrderAcceptComponent, OrderAccountsComponent, OrderSitesComponent, OrderNewComponent,
    OrderFormComponent, OrderEditComponent, OrderCopyComponent, OrderDeclineComponent, OrderQuickAccountsComponent,
    OrderQuickSiteComponent, OrderQuickFormComponent, OrderQuickComponent, OrderPriceListCustomItemModalComponent,
    OrderPriceListAddItemComponent, OrderEditAccountsComponent, OrderEditSitesComponent, OrderMaterialUpliftComponent,
    OrderCompleteComponent, OrderAddGradeComponent, OrderAddAccountComponent, OrderAddSiteComponent, OrderQuickAddAccountComponent,
    OrderSimpleSiteComponent, OrderSimpleFormComponent, OrderSimpleComponent, OrderSimpleAccountsComponent, OrderCopyAccountsComponent, OrderCopySitesComponent,OrdersArticComponent,OrderCsvToJsonComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgSelectModule,
    CoreModule,
    AccountModule,
    QuotingModule,
    OrderRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ],
  exports: [
    OrderEditComponent,
    OrderPriceListCustomItemModalComponent,
    OrderAddGradeComponent,
    OrderMaterialUpliftComponent,
    OrderPriceListAddItemComponent,
  ]
})
export class OrderModule { }
