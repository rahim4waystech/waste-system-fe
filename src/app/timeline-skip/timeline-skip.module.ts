import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineSkipRoutingModule } from './timeline-skip-routing.module';
import { TimelineSkipComponent } from './pages/timeline-skip/timeline-skip.component';
import { TimelineSkipToolbarComponent } from './partials/timeline-skip-toolbar/timeline-skip-toolbar.component';
import { TimelineSkipMainComponent } from './partials/timeline-skip-main/timeline-skip-main.component';
import { TimelineSkipAcceptedJobsComponent } from './partials/timeline-skip-accepted-jobs/timeline-skip-accepted-jobs.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SkipAcceptedOrderInformationModalComponent } from './modals/skip-accepted-order-information-modal/skip-accepted-order-information-modal.component';
import { SkipRoundNewModalComponent } from './modals/skip-round-new-modal/skip-round-new-modal.component';
import { SkipRoundEditModalComponent } from './modals/skip-round-edit-modal/skip-round-edit-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UiSwitchModule } from 'ngx-toggle-switch';


// RECOMMENDED
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SkipVorAndAbsenceComponent } from './modals/skip-vor-and-absence/skip-vor-and-absence.component';

import { NgSelectModule,NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import { SkipResolveIssueComponent } from './modals/skip-resolve-issue/skip-resolve-issue.component';

@NgModule({
  declarations: [TimelineSkipComponent, TimelineSkipToolbarComponent, TimelineSkipMainComponent, TimelineSkipAcceptedJobsComponent, SkipAcceptedOrderInformationModalComponent, SkipRoundNewModalComponent, SkipRoundEditModalComponent, SkipVorAndAbsenceComponent, SkipResolveIssueComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    DragDropModule,
    CoreModule,
    NgSelectModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    UiSwitchModule,
    TimelineSkipRoutingModule,

  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class TimelineSkipModule { }
