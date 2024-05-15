import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchRoutingModule } from './batch-routing.module';
import { BatchComponent } from './pages/batch/batch.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [BatchComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    BatchRoutingModule
  ]
})
export class BatchModule { }
