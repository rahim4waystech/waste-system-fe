import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { DriversComponent } from './pages/drivers/drivers.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DriverNewComponent } from './pages/driver-new/driver-new.component';
import { DriverFormComponent } from './partials/driver-form/driver-form.component';
import { DriverEditComponent } from './pages/driver-edit/driver-edit.component';
import { DriverAbsenceComponent } from './pages/driver-absence/driver-absence.component';
import { DriverAbsenceFormComponent } from './partials/driver-absence-form/driver-absence-form.component';
import { DriverAbsenceNewComponent } from './pages/driver-absence-new/driver-absence-new.component';
import { DriverAbsenceEditComponent } from './pages/driver-absence-edit/driver-absence-edit.component';
import { DriverAbsenceCancelComponent } from './pages/driver-absence-cancel/driver-absence-cancel.component';
import { DriverHoursComponent } from './pages/driver-hours/driver-hours.component';
import { DriverHoursAdvancedComponent } from './pages/driver-hours-advanced/driver-hours-advanced.component';
import { DriverHoursNewComponent } from './pages/driver-hours-new/driver-hours-new.component';
import { DriverHoursFormComponent } from './partials/driver-hours-form/driver-hours-form.component';
import { DriverHoursEditComponent } from './pages/driver-hours-edit/driver-hours-edit.component';
import { DriverBonusLevelComponent } from './pages/driver-bonus-level/driver-bonus-level.component';
import { DriverBonusLevelFormComponent } from './partials/driver-bonus-level-form/driver-bonus-level-form.component';
import { DriverBonusLevelNewComponent } from './pages/driver-bonus-level-new/driver-bonus-level-new.component';
import { DriverBonusLevelEditComponent } from './pages/driver-bonus-level-edit/driver-bonus-level-edit.component';

import { NgSelectModule,NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';

 

@NgModule({
  declarations: [DriversComponent, DriverNewComponent, DriverFormComponent, DriverEditComponent, DriverAbsenceComponent, DriverAbsenceFormComponent, DriverAbsenceNewComponent, DriverAbsenceEditComponent, DriverAbsenceCancelComponent, DriverHoursComponent, DriverHoursAdvancedComponent, DriverHoursNewComponent, DriverHoursFormComponent, DriverHoursEditComponent, DriverBonusLevelComponent, DriverBonusLevelFormComponent, DriverBonusLevelNewComponent, DriverBonusLevelEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgSelectModule,
    CoreModule,
    DriverRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class DriverModule { }
