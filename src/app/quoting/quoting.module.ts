import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotingRoutingModule } from './quoting-routing.module';
import { QuotingComponent } from './pages/quoting/quoting.component';
import { ProductsComponent } from './pages/products/products.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from './partials/product-form/product-form.component';
import { ProductNewComponent } from './pages/product-new/product-new.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { QuoteCustomerComponent } from './pages/quote-customer/quote-customer.component';
import { QuoteSiteComponent } from './pages/quote-site/quote-site.component';
import { QuoteNewComponent } from './pages/quote-new/quote-new.component';
import { QuoteFormsComponent } from './partials/quote-forms/quote-forms.component';
import { QuoteAddProductComponent } from './modals/quote-add-product/quote-add-product.component';
import { QuoteEditComponent } from './pages/quote-edit/quote-edit.component';
import { QuoteAcceptComponent } from './pages/quote-accept/quote-accept.component';
import { QuoteDeclineComponent } from './pages/quote-decline/quote-decline.component';


@NgModule({
  declarations: [QuotingComponent, ProductsComponent, ProductFormComponent, ProductNewComponent, ProductEditComponent, QuoteCustomerComponent, QuoteSiteComponent, QuoteNewComponent, QuoteFormsComponent, QuoteAddProductComponent, QuoteEditComponent, QuoteAcceptComponent, QuoteDeclineComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    QuotingRoutingModule
  ],
  exports: [
    QuoteAddProductComponent,
  ]
})
export class QuotingModule { }
