import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineArticRoutingModule } from './timeline-artic-routing.module';
import { TimelineArticComponent } from './pages/timeline-artic/timeline-artic.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CoreModule } from '../core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ArticNewRoundModalComponent } from './modals/artic-new-round-modal/artic-new-round-modal.component';
import { ArticViewOrderModalComponent } from './modals/artic-view-order-modal/artic-view-order-modal.component';
import { ArticSetJobModalComponent } from './modals/artic-set-job-modal/artic-set-job-modal.component';

@NgModule({
  declarations: [TimelineArticComponent, ArticNewRoundModalComponent, ArticViewOrderModalComponent, ArticSetJobModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    DragDropModule,
    CoreModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    TimelineArticRoutingModule
  ]
})
export class TimelineArticModule { }
