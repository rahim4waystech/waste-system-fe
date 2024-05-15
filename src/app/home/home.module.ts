import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CoreModule } from '../core/core.module';
import { JobsByVehicleGraphComponent } from './partials/jobs-by-vehicle-graph/jobs-by-vehicle-graph.component';
import { GrossProfitBySalesmanGraphComponent } from './partials/gross-profit-by-salesman-graph/gross-profit-by-salesman-graph.component';
import { VehicleUtilisationGraphComponent } from './partials/vehicle-utilisation-graph/vehicle-utilisation-graph.component';
import { ContractEndingGridComponent } from './partials/contract-ending-grid/contract-ending-grid.component';
import { LastOrderDateGridComponent } from './partials/last-order-date-grid/last-order-date-grid.component';
import { InvoiceStatusGraphComponent } from './partials/invoice-status-graph/invoice-status-graph.component';
import { VehicleAvailabilityGraphComponent } from './partials/vehicle-availability-graph/vehicle-availability-graph.component';
import { VehicleStatusGraphComponent } from './partials/vehicle-status-graph/vehicle-status-graph.component';
import { DailyDriverChecksGraphComponent } from './partials/daily-driver-checks-graph/daily-driver-checks-graph.component';
import { InspectionsDueComponent } from './partials/inspections-due/inspections-due.component';
import { InvoicesToBeAuthorisedComponent } from './partials/invoices-to-be-authorised/invoices-to-be-authorised.component';
import { CollectionsDueTodayComponent } from './partials/collections-due-today/collections-due-today.component';
import { IssuesFromDriversComponent } from './partials/issues-from-drivers/issues-from-drivers.component';


@NgModule({
  declarations: [HomeComponent, JobsByVehicleGraphComponent, GrossProfitBySalesmanGraphComponent, VehicleUtilisationGraphComponent, ContractEndingGridComponent, LastOrderDateGridComponent, InvoiceStatusGraphComponent, VehicleAvailabilityGraphComponent, VehicleStatusGraphComponent, DailyDriverChecksGraphComponent, InspectionsDueComponent, InvoicesToBeAuthorisedComponent, CollectionsDueTodayComponent, IssuesFromDriversComponent],
  imports: [
    CommonModule,
    CoreModule,
    BrowserModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
