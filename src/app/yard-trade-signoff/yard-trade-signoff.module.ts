import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YardTradeSignoffRoutingModule } from './yard-trade-signoff-routing.module';
import { YardTradeSignoffComponent } from './pages/yard-trade-signoff/yard-trade-signoff.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [YardTradeSignoffComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    YardTradeSignoffRoutingModule
  ]
})
export class YardTradeSignoffModule { }
