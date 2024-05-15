import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuelRoutingModule } from './fuel-routing.module';
import { FuelComponent } from './pages/fuel/fuel.component';
import { FuelPricesComponent } from './pages/fuel-prices/fuel-prices.component';
import { CoreModule } from '../core/core.module';
import { FuelPricesNewComponent } from './pages/fuel-prices-new/fuel-prices-new.component';
import { FuelPriceFormComponent } from './partials/fuel-price-form/fuel-price-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FuelPricesEditComponent } from './pages/fuel-prices-edit/fuel-prices-edit.component';
import { FuelAdvancedComponent } from './pages/fuel-advanced/fuel-advanced.component';
import { FuelNewComponent } from './pages/fuel-new/fuel-new.component';
import { FuelFormComponent } from './partials/fuel-form/fuel-form.component';
import { FuelEditComponent } from './pages/fuel-edit/fuel-edit.component';


@NgModule({
  declarations: [FuelComponent, FuelPricesComponent, FuelPricesNewComponent, FuelPriceFormComponent, FuelPricesEditComponent, FuelAdvancedComponent, FuelNewComponent, FuelFormComponent, FuelEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    FuelRoutingModule
  ]
})
export class FuelModule { }
