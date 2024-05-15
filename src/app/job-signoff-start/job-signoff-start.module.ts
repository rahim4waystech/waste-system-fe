import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSignoffStartRoutingModule } from './job-signoff-start-routing.module';
import { JobSignoffStartComponent } from './pages/job-signoff-start/job-signoff-start.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [JobSignoffStartComponent],
  imports: [
    CommonModule,
    CoreModule,
    BrowserModule,
    FormsModule,
    JobSignoffStartRoutingModule
  ]
})
export class JobSignoffStartModule { }
