import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSignoffShredderRoutingModule } from './job-signoff-shredder-routing.module';
import { JobSignoffShredderComponent } from './pages/job-signoff-shredder/job-signoff-shredder.component';
import { JobSignoffShredderManagerComponent } from './partials/job-signoff-shredder-manager/job-signoff-shredder-manager.component';
import { JobSignoffShredderTransportComponent } from './partials/job-signoff-shredder-transport/job-signoff-shredder-transport.component';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JobSignoffShredderViewComponent } from './pages/job-signoff-shredder-view/job-signoff-shredder-view.component';
import { JobSignoffShredderEditComponent } from './pages/job-signoff-shredder-edit/job-signoff-shredder-edit.component';
import { JobSignoffModule } from '../job-signoff/job-signoff.module';


@NgModule({
  declarations: [JobSignoffShredderComponent, JobSignoffShredderManagerComponent, JobSignoffShredderTransportComponent, JobSignoffShredderViewComponent, JobSignoffShredderEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    CoreModule,
    JobSignoffModule,
    JobSignoffShredderRoutingModule
  ]
})
export class JobSignoffShredderModule { }
