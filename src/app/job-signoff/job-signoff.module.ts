import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSignoffRoutingModule } from './job-signoff-routing.module';
import { JobSignoffComponent } from './pages/job-signoff/job-signoff.component';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JobSignoffViewComponent } from './pages/job-signoff-view/job-signoff-view.component';
import { JobSignoffRescheduleModalComponent } from './modals/job-signoff-reschedule-modal/job-signoff-reschedule-modal.component';
import { JobSignoffChargesOnlyComponent } from './modals/job-signoff-charges-only/job-signoff-charges-only.component';
import { JobSignoffTransportComponent } from './partials/job-signoff-transport/job-signoff-transport.component';
import { JobSignoffManagerComponent } from './partials/job-signoff-manager/job-signoff-manager.component';
import { JobSignoffEditManagerComponent } from './pages/job-signoff-edit-manager/job-signoff-edit-manager.component';


@NgModule({
  declarations: [JobSignoffComponent, JobSignoffViewComponent, JobSignoffRescheduleModalComponent, JobSignoffChargesOnlyComponent, JobSignoffTransportComponent, JobSignoffManagerComponent, JobSignoffEditManagerComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    BrowserModule,
    JobSignoffRoutingModule
  ],
  exports: [JobSignoffRescheduleModalComponent, JobSignoffChargesOnlyComponent]
})
export class JobSignoffModule { }
