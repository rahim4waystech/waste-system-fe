import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSignoffArticRoutingModule } from './job-signoff-artic-routing.module';
import { JobSignoffArticComponent } from './pages/job-signoff-artic/job-signoff-artic.component';
import { JobSignoffArticManagerComponent } from './partials/job-signoff-artic-manager/job-signoff-artic-manager.component';
import { JobSignoffArticTransportComponent } from './partials/job-signoff-artic-transport/job-signoff-artic-transport.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { JobSignoffArticViewComponent } from './pages/job-signoff-artic-view/job-signoff-artic-view.component';
import { JobSignoffArticEditComponent } from './pages/job-signoff-artic-edit/job-signoff-artic-edit.component';
import { JobSignoffModule } from '../job-signoff/job-signoff.module';


@NgModule({
  declarations: [JobSignoffArticComponent, JobSignoffArticManagerComponent, JobSignoffArticTransportComponent, JobSignoffArticViewComponent, JobSignoffArticEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    JobSignoffModule,
    JobSignoffArticRoutingModule
  ]
})
export class JobSignoffArticModule { }
