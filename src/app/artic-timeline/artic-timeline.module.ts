import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticTimelineRoutingModule } from './artic-timeline-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule, NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from 'angular-calendar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountModule } from '../account/account.module';
import { CoreModule } from '../core/core.module';
import { JobSignoffLandServicesModule } from '../job-signoff-land-services/job-signoff-land-services.module';
import { OrderModule } from '../order/order.module';
import { TimelineTransportRoutingModule } from '../timeline-transport/timeline-transport-routing.module';
import { ArticTimelineAddSiteComponent } from './modals/artic-timeline-add-site/artic-timeline-add-site.component';
import { ArticTimelineTransportAddAssignmentNoteComponent } from './modals/artic-timeline-transport-add-assignment-note/artic-timeline-transport-add-assignment-note.component';
import { ArticTimelineTransportAddNoteComponent } from './modals/artic-timeline-transport-add-note/artic-timeline-transport-add-note.component';
import { ArticTimelineTransportAddRowModalComponent } from './modals/artic-timeline-transport-add-row-modal/artic-timeline-transport-add-row-modal.component';
import { ArticTimelineTransportAllOrdersComponent } from './modals/artic-timeline-transport-all-orders/artic-timeline-transport-all-orders.component';
import { ArticTimelineTransportCopyJobToUnitComponent } from './modals/artic-timeline-transport-copy-job-to-unit/artic-timeline-transport-copy-job-to-unit.component';
import { ArticTimelineTransportCopyJobsComponent } from './modals/artic-timeline-transport-copy-jobs/artic-timeline-transport-copy-jobs.component';
import { ArticTimelineTransportEditJobComponent } from './modals/artic-timeline-transport-edit-job/artic-timeline-transport-edit-job.component';
import { ArticTimelineTransportEditOrderModalComponent } from './modals/artic-timeline-transport-edit-order-modal/artic-timeline-transport-edit-order-modal.component';
import { ArticTimelineTransportEditRowModalComponent } from './modals/artic-timeline-transport-edit-row-modal/artic-timeline-transport-edit-row-modal.component';
import { ArticTimelineTransportJobInformationComponent } from './modals/artic-timeline-transport-job-information/artic-timeline-transport-job-information.component';
import { ArticTimelineTransportNewJobComponent } from './modals/artic-timeline-transport-new-job/artic-timeline-transport-new-job.component';
import { ArticTimelineTransportOrderInformationComponent } from './modals/artic-timeline-transport-order-information/artic-timeline-transport-order-information.component';
import { ArticTimelineTransportComponent } from './pages/artic-timeline-transport/artic-timeline-transport.component';
import { ArticTimelineTransportAcceptedOrdersComponent } from './partals/artic-timeline-transport-accepted-orders/artic-timeline-transport-accepted-orders.component';
import { ArticTimelineTransportMainVerticalComponent } from './partals/artic-timeline-transport-main-vertical/artic-timeline-transport-main-vertical.component';
import { ArticTimelineTransportMainComponent } from './partals/artic-timeline-transport-main/artic-timeline-transport-main.component';
import { ArticTimelineTransportToolbarComponent } from './partals/artic-timeline-transport-toolbar/artic-timeline-transport-toolbar.component';
import { ArticTimelineTransportVorAndAbsenceComponent } from './partals/artic-timeline-transport-vor-and-absence/artic-timeline-transport-vor-and-absence.component';
import { ArticOrderRemoveProvisionComponent } from './modals/artic-order-remove-provision/artic-order-remove-provision.component';


@NgModule({
  declarations: [ArticTimelineTransportComponent,
    ArticTimelineTransportAcceptedOrdersComponent, 
    ArticTimelineTransportAddRowModalComponent, 
    ArticTimelineTransportEditRowModalComponent, 
    ArticTimelineTransportToolbarComponent, 
    ArticTimelineTransportMainComponent, 
    ArticTimelineTransportVorAndAbsenceComponent, 
    ArticTimelineTransportOrderInformationComponent, 
    ArticTimelineTransportNewJobComponent, 
    ArticTimelineTransportEditJobComponent, 
    ArticTimelineTransportMainVerticalComponent, 
    ArticTimelineTransportAddNoteComponent, 
    ArticTimelineTransportJobInformationComponent, 
    ArticTimelineTransportAllOrdersComponent, 
    ArticTimelineAddSiteComponent, 
    ArticTimelineTransportCopyJobsComponent, 
    ArticTimelineTransportEditOrderModalComponent, 
    ArticTimelineTransportCopyJobToUnitComponent, 
    ArticTimelineTransportAddAssignmentNoteComponent, ArticOrderRemoveProvisionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    CoreModule,
    AccountModule,
    JobSignoffLandServicesModule,
    OrderModule,
    NgSelectModule,
    BsDatepickerModule,
    ArticTimelineRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class ArticTimelineModule { }
