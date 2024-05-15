import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineTransportRoutingModule } from './timeline-transport-routing.module';
import { TimelineTransportComponent } from './pages/timeline-transport/timeline-transport.component';
import { TimelineTransportAcceptedOrdersComponent } from './partals/timeline-transport-accepted-orders/timeline-transport-accepted-orders.component';
import { TimelineTransportAddRowModalComponent } from './modals/timeline-transport-add-row-modal/timeline-transport-add-row-modal.component';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TimelineTransportEditRowModalComponent } from './modals/timeline-transport-edit-row-modal/timeline-transport-edit-row-modal.component';
import { TimelineTransportToolbarComponent } from './partals/timeline-transport-toolbar/timeline-transport-toolbar.component';
import { TimelineTransportMainComponent } from './partals/timeline-transport-main/timeline-transport-main.component';
import { TimelineTransportVorAndAbsenceComponent } from './partals/timeline-transport-vor-and-absence/timeline-transport-vor-and-absence.component';
import { TimelineTransportOrderInformationComponent } from './modals/timeline-transport-order-information/timeline-transport-order-information.component';
import { TimelineTransportNewJobComponent } from './modals/timeline-transport-new-job/timeline-transport-new-job.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimelineTransportEditJobComponent } from './modals/timeline-transport-edit-job/timeline-transport-edit-job.component';
import { TimelineTransportMainVerticalComponent } from './partals/timeline-transport-main-vertical/timeline-transport-main-vertical.component';
import { NgSelectModule,NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import { TimelineTransportAddNoteComponent } from './modals/timeline-transport-add-note/timeline-transport-add-note.component';
import { TimelineTransportJobInformationComponent } from './modals/timeline-transport-job-information/timeline-transport-job-information.component';
import { TimelineTransportAllOrdersComponent } from './modals/timeline-transport-all-orders/timeline-transport-all-orders.component';
import { TimelineAddSiteComponent } from './modals/timeline-add-site/timeline-add-site.component';
import { AccountModule } from '../account/account.module';
import { TimelineTransportCopyJobsComponent } from './modals/timeline-transport-copy-jobs/timeline-transport-copy-jobs.component';
import { JobSignoffLandServicesModule } from '../job-signoff-land-services/job-signoff-land-services.module';
import { TimelineTransportEditOrderModalComponent } from './modals/timeline-transport-edit-order-modal/timeline-transport-edit-order-modal.component';
import { OrderModule } from '../order/order.module';
import { TimelineTransportCopyJobToUnitComponent } from './modals/timeline-transport-copy-job-to-unit/timeline-transport-copy-job-to-unit.component';
import { TimelineArticContractOrdersComponent } from './partals/timeline-artic-contract-orders/timeline-artic-contract-orders.component';
import { TimelineTransportArticMakeDailyComponent } from './modals/timeline-transport-artic-make-daily/timeline-transport-artic-make-daily.component';
import { TimelineTransportAddAssignmentNoteComponent } from './modals/timeline-transport-add-assignment-note/timeline-transport-add-assignment-note.component';

@NgModule({
  declarations: [TimelineTransportComponent, TimelineTransportAcceptedOrdersComponent, TimelineTransportAddRowModalComponent, TimelineTransportEditRowModalComponent, TimelineTransportToolbarComponent, TimelineTransportMainComponent, TimelineTransportVorAndAbsenceComponent, TimelineTransportOrderInformationComponent, TimelineTransportNewJobComponent, TimelineTransportEditJobComponent, TimelineTransportMainVerticalComponent, TimelineTransportAddNoteComponent, TimelineTransportJobInformationComponent, TimelineTransportAllOrdersComponent, TimelineAddSiteComponent, TimelineTransportCopyJobsComponent, TimelineTransportEditOrderModalComponent, TimelineTransportCopyJobToUnitComponent, TimelineArticContractOrdersComponent, TimelineTransportArticMakeDailyComponent, TimelineTransportAddAssignmentNoteComponent],
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
    TimelineTransportRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class TimelineTransportModule { }
