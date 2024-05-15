import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './pages/jobs/jobs.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { JobsEditComponent } from './pages/jobs-edit/jobs-edit.component';
import { JobFormComponent } from './partials/job-form/job-form.component';
import { JobSelectCustomerModalComponent } from './modals/job-select-customer-modal/job-select-customer-modal.component';
import { JobsNewSelectOrderComponent } from './pages/jobs-new-select-order/jobs-new-select-order.component';
import { JobsNewComponent } from './pages/jobs-new/jobs-new.component';


@NgModule({
  declarations: [JobsComponent, JobsEditComponent, JobFormComponent, JobSelectCustomerModalComponent, JobsNewSelectOrderComponent, JobsNewComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    JobsRoutingModule
  ]
})
export class JobsModule { }
