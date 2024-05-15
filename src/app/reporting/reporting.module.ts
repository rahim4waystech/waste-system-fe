import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './pages/reporting/reporting.component';
import { ReportLoadCounterComponent } from './pages/report-load-counter/report-load-counter.component';
import { NgSelectConfig, NgSelectModule, ɵs } from '@ng-select/ng-select';
import { ReportFindInvoiceByTicketComponent } from './pages/report-find-invoice-by-ticket/report-find-invoice-by-ticket.component';
import { ReportTonneCounterComponent } from './pages/report-tonne-counter/report-tonne-counter.component';
import { ReportJobsComponent } from './pages/report-jobs/report-jobs.component';
import { ReportSameCustomerSiteComponent } from './pages/report-same-customer-site/report-same-customer-site.component';
import { ReportJobsSepaComponent } from './pages/report-jobs-sepa/report-jobs-sepa.component';


@NgModule({
  declarations: [ReportingComponent, ReportLoadCounterComponent, ReportFindInvoiceByTicketComponent, ReportTonneCounterComponent, ReportJobsComponent, ReportSameCustomerSiteComponent, ReportJobsSepaComponent],
  imports: [
    CommonModule,
    BrowserModule,
    CoreModule,
    NgSelectModule,
    FormsModule,
    ReportingRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class ReportingModule { }
