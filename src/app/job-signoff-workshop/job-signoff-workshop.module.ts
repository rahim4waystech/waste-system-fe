import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSignoffWorkshopRoutingModule } from './job-signoff-workshop-routing.module';
import { JobSignoffWorkshopComponent } from './pages/job-signoff-workshop/job-signoff-workshop.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { JobSignoffWorkshopFitterComponent } from './partials/job-signoff-workshop-fitter/job-signoff-workshop-fitter.component';
import { JobSignoffWorkshopManagerComponent } from './partials/job-signoff-workshop-manager/job-signoff-workshop-manager.component';
import { WorkshopModule } from '../workshop/workshop.module';
import { JobSignoffWorkshopManagerViewComponent } from './pages/job-signoff-workshop-manager-view/job-signoff-workshop-manager-view.component';
import { JobSignoffWorkshopFitterModalComponent } from './modals/job-signoff-workshop-fitter-modal/job-signoff-workshop-fitter-modal.component';


@NgModule({
  declarations: [JobSignoffWorkshopComponent, JobSignoffWorkshopFitterComponent, JobSignoffWorkshopManagerComponent, JobSignoffWorkshopManagerViewComponent, JobSignoffWorkshopFitterModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    WorkshopModule,
    CoreModule,
    JobSignoffWorkshopRoutingModule
  ]
})
export class JobSignoffWorkshopModule { }
