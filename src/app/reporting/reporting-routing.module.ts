import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportFindInvoiceByTicketComponent } from './pages/report-find-invoice-by-ticket/report-find-invoice-by-ticket.component';
import { ReportJobsSepaComponent } from './pages/report-jobs-sepa/report-jobs-sepa.component';
import { ReportJobsComponent } from './pages/report-jobs/report-jobs.component';
import { ReportLoadCounterComponent } from './pages/report-load-counter/report-load-counter.component';
import { ReportSameCustomerSiteComponent } from './pages/report-same-customer-site/report-same-customer-site.component';
import { ReportTonneCounterComponent } from './pages/report-tonne-counter/report-tonne-counter.component';
import { ReportingComponent } from './pages/reporting/reporting.component';


const routes: Routes = [
  {path:'reporting',component:ReportingComponent},
  {path:'reporting/load-count', component: ReportLoadCounterComponent},
  {path:'reporting/tonne-count', component: ReportTonneCounterComponent},
  {path:'reporting/invoice-ticket', component: ReportFindInvoiceByTicketComponent},
  {path:'reporting/jobs', component: ReportJobsComponent},
  {path:'reporting/same-customer-site', component: ReportSameCustomerSiteComponent},
  {path:'reporting/jobs-sepa', component: ReportJobsSepaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
