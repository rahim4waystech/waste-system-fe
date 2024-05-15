import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkshopComponent } from './pages/workshop/workshop.component';
import { DefectsComponent } from './pages/defects/defects.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { WorkshopVehiclesComponent } from './pages/vehicles/vehicles.component';
import { WorkshopReportingComponent } from './pages/reporting/reporting.component';

import { VehicleViewComponent } from './components/workshop-vehicles/vehicle-view/vehicle-view.component';
import { WorkshopVehicleNewComponent } from './components/workshop-vehicles/vehicle-new/vehicle-new.component';
import { DriverChecksComponent } from './components/driver-checks/driver-checks/driver-checks.component';
import { ViewDriverChecksComponent } from './components/driver-checks/view-driver-checks/view-driver-checks.component';
import { NewDefectComponent } from './components/defects/new-defect/new-defect.component';
import { EditDefectComponent } from './components/defects/edit-defect/edit-defect.component';
import { WorkshopSubcontractorsComponent } from './pages/workshop-subcontractors/workshop-subcontractors.component';
import { NewWorkshopSubcontractorComponent } from './components/new-workshop-subcontractor/new-workshop-subcontractor.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { DriverDefectsComponent } from './components/driver-defects/driver-defects.component';
import { DocumentsComponent } from './components/docs/documents/documents.component';
import { AssetRegisterComponent } from './components/assets/asset-register/asset-register.component';
import { ViewDocumentsComponent } from './components/docs/view-documents/view-documents.component';
import { ViewAssetsComponent } from './components/assets/view-assets/view-assets.component';
import { IntervalsComponent } from './components/settings/intervals/intervals.component';
import { SeveritiesComponent } from './components/settings/severities/severities.component';
import { VehicletypesComponent } from './components/settings/vehicletypes/vehicletypes.component';
import { CheckareasComponent } from './components/settings/checkareas/checkareas.component';
import { AssetcategoriesComponent } from './components/settings/assetcategories/assetcategories.component';
import { DriverReportComponent } from './components/driver-report/driver-report.component';
import { HistoricInspectionsComponent } from './components/workshop-vehicles/historic-inspections/historic-inspections.component';
import { PartsComponent } from './pages/parts/parts.component';
import { PartCategoriesComponent } from './components/settings/part-categories/part-categories.component';


const routes: Routes = [
  {path:'4workshop',component:WorkshopComponent},
  {path:'4workshop/vehicles',component:WorkshopVehiclesComponent},
  {path:'4workshop/subcontractors',component:WorkshopSubcontractorsComponent},
  {path:'4workshop/subcontractors/new',component:NewWorkshopSubcontractorComponent},
  {path:'4workshop/subcontractors/:id',component:NewWorkshopSubcontractorComponent},
  {path:'4workshop/defects',component:DefectsComponent},
  {path:'4workshop/documents',component:DocumentsComponent},
  {path:'4workshop/asset-register',component:AssetRegisterComponent},
  {path:'4workshop/parts-register',component:PartsComponent},
  {path:'4workshop/schedule',component:ScheduleComponent},
  {path:'4workshop/settings',component:SettingsComponent},
  {path:'4workshop/inspection-intervals',component:IntervalsComponent},
  {path:'4workshop/part-categories',component:PartCategoriesComponent},
  {path:'4workshop/severities',component:SeveritiesComponent},
  {path:'4workshop/check-areas',component:CheckareasComponent},
  {path:'4workshop/vehicle-types',component:VehicletypesComponent},
  {path:'4workshop/asset-categories',component:AssetcategoriesComponent},
  {path:'4workshop/reporting',component:WorkshopReportingComponent},
  {path:'4workshop/assets',component:ViewAssetsComponent},
  {path:'4workshop/vehicle/new',component:WorkshopVehicleNewComponent},
  {path:'4workshop/vehicle/:id',component:VehicleViewComponent},
  {path:'4workshop/defect/new',component:NewDefectComponent},
  {path:'4workshop/defect/:id',component:EditDefectComponent},
  {path:'4workshop/historicinspections/:id',component:HistoricInspectionsComponent},
  {path:'4workshop/driverchecks',component:DriverChecksComponent},
  {path:'4workshop/driver-report',component:DriverReportComponent},
  {path:'4workshop/docs/:id',component:ViewDocumentsComponent},
  {path:'4workshop/assets/:id',component:ViewAssetsComponent},
  // {path:'4workshop/driverdefects',component:DriverDefectsComponent},
  {path:'4workshop/driver-report/:id',component:ViewDriverChecksComponent},
  {path:'4workshop/vehicle/new/:id',component:WorkshopVehicleNewComponent},
  {path:'4workshop/defect/new/:id',component:NewDefectComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopRoutingModule { }
