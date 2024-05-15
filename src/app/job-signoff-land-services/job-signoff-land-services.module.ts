import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSignoffLandServicesRoutingModule } from './job-signoff-land-services-routing.module';
import { JobSignoffLandComponent } from './pages/job-signoff-land/job-signoff-land.component';
import { CoreModule } from '../core/core.module';
import { JobSignoffManagerLandComponent } from './partials/job-signoff-manager-land/job-signoff-manager-land.component';
import { JobSignoffTransportLandComponent } from './partials/job-signoff-transport-land/job-signoff-transport-land.component';
import { JobSignoffLandViewComponent } from './pages/job-signoff-land-view/job-signoff-land-view.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { JobSignoffModule } from '../job-signoff/job-signoff.module';
import { JobSignoffLandEditComponent } from './pages/job-signoff-land-edit/job-signoff-land-edit.component';
import { CreateInvoiceModalComponent } from './modals/create-invoice-modal/create-invoice-modal.component';
import { JobSignoffDeleteJobComponent } from './pages/job-signoff-delete-job/job-signoff-delete-job.component';
import { NgSelectConfig, NgSelectModule, ɵs } from '@ng-select/ng-select';
import { JobSignoffLandEditJobComponent } from './modals/job-signoff-land-edit-job/job-signoff-land-edit-job.component';
import { JobSignoffLandDeleteAllComponent } from './modals/job-signoff-land-delete-all/job-signoff-land-delete-all.component';
import { JobSignoffLandDeleteAllJobsComponent } from './pages/job-signoff-land-delete-all-jobs/job-signoff-land-delete-all-jobs.component';
import { JobSignoffInvoiceGeneratePreviewComponent } from './pages/job-signoff-invoice-generate-preview/job-signoff-invoice-generate-preview.component';
import { InvoiceModule } from '../invoice/invoice.module';


@NgModule({
  declarations: [JobSignoffLandComponent, JobSignoffManagerLandComponent, JobSignoffTransportLandComponent, JobSignoffLandViewComponent, JobSignoffLandEditComponent, CreateInvoiceModalComponent, JobSignoffDeleteJobComponent, JobSignoffLandEditJobComponent, JobSignoffLandDeleteAllComponent, JobSignoffLandDeleteAllJobsComponent, JobSignoffInvoiceGeneratePreviewComponent],
  imports: [
    CommonModule,
    CoreModule,
    BrowserModule,
    FormsModule,
    NgSelectModule,
    InvoiceModule,
    JobSignoffModule,
    JobSignoffLandServicesRoutingModule
  ],
  exports: [
    JobSignoffLandEditJobComponent,
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class JobSignoffLandServicesModule { }
