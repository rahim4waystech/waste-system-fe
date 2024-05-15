import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { ContainerModule } from './container/container.module';
import { AuthService } from './auth/services/auth.service';
import { OAuthStorage, OAuthModule } from 'angular-oauth2-oidc';
import { AuthInterceptor } from './auth/services/auth.interceptor';
import { FuelModule } from './fuel/fuel.module';
import { SettingsModule } from './settings/settings.module';
import { AccountModule } from './account/account.module';
import { TimelineSkipModule } from './timeline-skip/timeline-skip.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { TimelineArticModule } from './timeline-artic/timeline-artic.module';
import { QuotingModule } from './quoting/quoting.module';
import { JobSignoffModule } from './job-signoff/job-signoff.module';
import { InvoiceModule } from './invoice/invoice.module';
import { BatchModule } from './batch/batch.module';
import { WeighbridgeModule } from './weighbridge/weighbridge.module';
import { TimelineTransportModule } from './timeline-transport/timeline-transport.module';
import { TimelineTransport2Module } from './timeline-transport2/timeline-transport2.module';
import { WorkshopModule } from './workshop/workshop.module';
import { ReportingModule } from './reporting/reporting.module';
import { JobSignoffLandServicesModule } from './job-signoff-land-services/job-signoff-land-services.module';
import { JobsModule } from './jobs/jobs.module';
import { ContactModule } from './contact/contact.module';
import { ContractModule } from './contract/contract.module';
import { PublicFormsModule } from './public-forms/public-forms.module';
import { JobSignoffShredderModule } from './job-signoff-shredder/job-signoff-shredder.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { LeadsModule } from './leads/leads.module';
import { ShredderImporterModule } from './shredder-importer/shredder-importer.module';
import { JobSignoffArticModule } from './job-signoff-artic/job-signoff-artic.module';
import { FitterModule } from './fitter/fitter.module';
import { TimelineWorkshopModule } from './timeline-workshop/timeline-workshop.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule as CalendarModulePlugin, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { JobSignoffWorkshopModule } from './job-signoff-workshop/job-signoff-workshop.module';
import { ComplianceModule } from './compliance/compliance.module';
import { CalendarModule } from './calendar/calendar.module';
import { PodsModule } from './pods/pods.module';
import { JobSignoffStartModule } from './job-signoff-start/job-signoff-start.module';
import { PriceListModule } from './price-list/price-list.module';
import { TipTicketModule } from './tip-ticket/tip-ticket.module';
import { YardTradeSignoffModule } from './yard-trade-signoff/yard-trade-signoff.module';
import { JobSignoffMaterialUpliftModule } from './job-signoff-material-uplift/job-signoff-material-uplift.module';
import { ArticRunDiaryModule } from './artic-run-diary/artic-run-diary.module';
import { SimplifiedOrderingModule } from './simplified-ordering/simplified-ordering.module';
import { DriverModule } from './driver/driver.module';
import { SubcontractorModule } from './subcontractor/subcontractor.module';
import { ArticTimelineModule } from './artic-timeline/artic-timeline.module';
// import { TransportAddRowModalComponent } from './transport-add-row-modal/transport-add-row-modal.component';
// Move to config file
// Production Change
const config: SocketIoConfig = { url: 'http://124.29.237.188:52300', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    // TransportAddRowModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    SocketIoModule.forRoot(config),
    AuthModule,
    CoreModule,
    ContainerModule,
    DriverModule,
    SubcontractorModule,
    FuelModule,
    SettingsModule, 
    AccountModule,
    TimelineSkipModule,
    TimelineArticModule,
    ArticTimelineModule,
    QuotingModule,
    JobSignoffModule,
    InvoiceModule,
    BatchModule,
    WeighbridgeModule,
    TimelineTransportModule,
    WorkshopModule,
    ReportingModule,
    JobSignoffLandServicesModule,
    JobSignoffArticModule,
    JobsModule,
    ContactModule,
    ContractModule,
    PublicFormsModule,
    JobSignoffShredderModule,
    LeadsModule,
    ComplianceModule,
    OpportunitiesModule,
    ShredderImporterModule,
    FitterModule,
    TimelineWorkshopModule,
    JobSignoffWorkshopModule,
    PriceListModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    NgbModalModule,
    CalendarModulePlugin.forRoot({provide: DateAdapter,useFactory: adapterFactory,}),
    CalendarModule,
    PodsModule,
    JobSignoffStartModule,
    TipTicketModule,
    YardTradeSignoffModule,
    JobSignoffMaterialUpliftModule,
    ArticRunDiaryModule,
    SimplifiedOrderingModule,
    HomeModule,
    TimelineTransport2Module,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    { provide: OAuthStorage, useValue: localStorage },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
