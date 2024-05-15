import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineWorkshopRoutingModule } from './timeline-workshop-routing.module';
import { TimelineWorkshopComponent } from './pages/timeline-workshop/timeline-workshop.component';
import { TimelineWorkshopAcceptedDefectsComponent } from './partials/timeline-workshop-accepted-defects/timeline-workshop-accepted-defects.component';
import { TimelineWorkshopMainComponent } from './partials/timeline-workshop-main/timeline-workshop-main.component';
import { TimelineWorkshopToolbarComponent } from './partials/timeline-workshop-toolbar/timeline-workshop-toolbar.component';
import { TimelineWorkshopAbsenceComponent } from './partials/timeline-workshop-absence/timeline-workshop-absence.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { TimelineWorkshopDefectInformationComponent } from './modals/timeline-workshop-defect-information/timeline-workshop-defect-information.component';
import { TimelineWorkshopAddFitterComponent } from './modals/timeline-workshop-add-fitter/timeline-workshop-add-fitter.component';
import { TimelineWorkshopEditFitterComponent } from './modals/timeline-workshop-edit-fitter/timeline-workshop-edit-fitter.component';
import { WorkshopModule } from '../workshop/workshop.module';


@NgModule({
  declarations: [TimelineWorkshopComponent, TimelineWorkshopAcceptedDefectsComponent, TimelineWorkshopMainComponent, TimelineWorkshopToolbarComponent, TimelineWorkshopAbsenceComponent, TimelineWorkshopDefectInformationComponent, TimelineWorkshopAddFitterComponent, TimelineWorkshopEditFitterComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    BsDatepickerModule,
    WorkshopModule,
    CoreModule,
    TimelineWorkshopRoutingModule
  ]
})
export class TimelineWorkshopModule { }
