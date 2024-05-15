import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { WorkshopRoutingModule } from './workshop-routing.module';
import { WorkshopComponent } from './pages/workshop/workshop.component';
import { WorkshopVehiclesComponent } from './pages/vehicles/vehicles.component';
import { DefectsComponent } from './pages/defects/defects.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { WorkshopReportingComponent } from './pages/reporting/reporting.component';
import { WorkshopNavComponent } from './partials/workshop-nav/workshop-nav.component';
import { VehicleViewComponent } from './components/workshop-vehicles/vehicle-view/vehicle-view.component';
import { WorkshopVehicleNewComponent } from './components/workshop-vehicles/vehicle-new/vehicle-new.component';
import { VehicleModule } from '../vehicle/vehicle.module';
import { DriverChecksComponent } from './components/driver-checks/driver-checks/driver-checks.component';
import { ViewDriverChecksComponent } from './components/driver-checks/view-driver-checks/view-driver-checks.component';
import { NewDefectComponent } from './components/defects/new-defect/new-defect.component';
import { EditDefectComponent } from './components/defects/edit-defect/edit-defect.component';
import { WorkshopSubcontractorsComponent } from './pages/workshop-subcontractors/workshop-subcontractors.component';
import { DefectFormComponent } from './partials/defect-form/defect-form.component';
import { PartsFormComponent } from './partials/parts-form/parts-form.component';
import { WorkshopDepotsComponent } from './pages/workshop-depots/workshop-depots.component';
import { NewWorkshopSubcontractorComponent } from './components/new-workshop-subcontractor/new-workshop-subcontractor.component';
import { SubcontractorFormComponent } from './partials/subcontractor-form/subcontractor-form.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { DriverDefectsComponent } from './components/driver-defects/driver-defects.component';
import { ViewDocumentsComponent } from './components/docs/view-documents/view-documents.component';
import { ViewAssetsComponent } from './components/assets/view-assets/view-assets.component';
import { AssetRegisterComponent } from './components/assets/asset-register/asset-register.component';
import { DocumentsComponent } from './components/docs/documents/documents.component';
import { IntervalsComponent } from './components/settings/intervals/intervals.component';
import { SeveritiesComponent } from './components/settings/severities/severities.component';
import { CheckareasComponent } from './components/settings/checkareas/checkareas.component';
import { VehicletypesComponent } from './components/settings/vehicletypes/vehicletypes.component';
import { AssetcategoriesComponent } from './components/settings/assetcategories/assetcategories.component';
import { DriverReportComponent } from './components/driver-report/driver-report.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModalComponent } from './modals/calendar-modal/calendar-modal.component';
import { HistoricInspectionsComponent } from './components/workshop-vehicles/historic-inspections/historic-inspections.component';
import { PartsComponent } from './pages/parts/parts.component';
import { AddStockModalComponent } from './modals/add-stock-modal/add-stock-modal.component';
import { ViewStockModalComponent } from './modals/view-stock-modal/view-stock-modal.component';
import { EditStockModalComponent } from './modals/edit-stock-modal/edit-stock-modal.component';
import { ChangeStockModalComponent } from './modals/change-stock-modal/change-stock-modal.component';
import { DefectModalComponent } from './modals/defect-modal/defect-modal.component';
import { DefectDocModalComponent } from './modals/defect-doc-modal/defect-doc-modal.component';
import { DefectRejectModalComponent } from './modals/defect-reject-modal/defect-reject-modal.component';
import { PartCategoriesComponent } from './components/settings/part-categories/part-categories.component';


@NgModule({
  declarations: [
    WorkshopComponent,
    WorkshopVehiclesComponent,
    DefectsComponent,
    ScheduleComponent,
    WorkshopReportingComponent,
    WorkshopNavComponent,
    VehicleViewComponent,
    WorkshopVehicleNewComponent,
    DriverChecksComponent,
    ViewDriverChecksComponent,
    NewDefectComponent,
    EditDefectComponent,
    WorkshopSubcontractorsComponent,
    DefectFormComponent,
    PartsFormComponent,
    WorkshopDepotsComponent,
    NewWorkshopSubcontractorComponent,
    SubcontractorFormComponent,
    SettingsComponent,
    DriverDefectsComponent,
    AssetRegisterComponent,
    DocumentsComponent,
    ViewDocumentsComponent,
    ViewAssetsComponent,
    IntervalsComponent,
    SeveritiesComponent,
    CheckareasComponent,
    VehicletypesComponent,
    AssetcategoriesComponent,
    DriverReportComponent,
    CalendarModalComponent,
    HistoricInspectionsComponent,
    PartsComponent,
    AddStockModalComponent,
    ViewStockModalComponent,
    EditStockModalComponent,
    ChangeStockModalComponent,
    DefectModalComponent,
    DefectDocModalComponent,
    DefectRejectModalComponent,
    PartCategoriesComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    VehicleModule,
    NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BsDatepickerModule.forRoot(),
    FormsModule,
    CoreModule,
    WorkshopRoutingModule
  ],
  exports:[
    WorkshopNavComponent,
    WorkshopNavComponent,
    // VehicledetailFormComponent
  ]
})
export class WorkshopModule { }
