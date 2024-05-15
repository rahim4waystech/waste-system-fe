import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { CoreModule } from '../core/core.module';
import { VehicleNewComponent } from './pages/vehicle-new/vehicle-new.component';
import { VehicledetailFormComponent } from './partials/vehicledetail-form/vehicledetail-form.component';
import { VehicleFormComponent } from './partials/vehicle-form/vehicle-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { VehicleEditComponent } from './pages/vehicle-edit/vehicle-edit.component';
import { VehiclesVorComponent } from './pages/vehicles-vor/vehicles-vor.component';
import { VehicleVorFormComponent } from './partials/vehicle-vor-form/vehicle-vor-form.component';
import { VehiclesVorNewComponent } from './pages/vehicles-vor-new/vehicles-vor-new.component';
import { VehiclesVorEditComponent } from './pages/vehicles-vor-edit/vehicles-vor-edit.component';
import { VehiclesVorCancelComponent } from './pages/vehicles-vor-cancel/vehicles-vor-cancel.component';
import { WorkshopModule } from '../workshop/workshop.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AssetFormComponent } from './partials/asset-form/asset-form.component';
import { NgSelectModule,NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    VehiclesComponent,
    VehicleNewComponent,
    VehicledetailFormComponent,
    VehicleFormComponent,
    VehicleEditComponent,
    VehiclesVorComponent,
    VehicleVorFormComponent,
    VehiclesVorNewComponent,
    VehiclesVorEditComponent,
    VehiclesVorCancelComponent,
    AssetFormComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    NgSelectModule,
    VehicleRoutingModule,
    NgMultiSelectDropDownModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ],
  exports:[VehicleFormComponent,VehicledetailFormComponent,AssetFormComponent]
})
export class VehicleModule { }
