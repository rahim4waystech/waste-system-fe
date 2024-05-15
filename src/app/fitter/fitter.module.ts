import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FitterRoutingModule } from './fitter-routing.module';
import { FitterFormComponent } from './partials/fitter-form/fitter-form.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FitterNewComponent } from './pages/fitter-new/fitter-new.component';
import { FitterEditComponent } from './pages/fitter-edit/fitter-edit.component';
import { FittersComponent } from './pages/fitters/fitters.component';
import { WorkshopModule } from '../workshop/workshop.module';
import { FitterHoursAdvancedComponent } from './pages/fitter-hours-advanced/fitter-hours-advanced.component';
import { FitterHoursNewComponent } from './pages/fitter-hours-new/fitter-hours-new.component';
import { FitterHoursFormComponent } from './partials/fitter-hours-form/fitter-hours-form.component';
import { FitterHoursEditComponent } from './pages/fitter-hours-edit/fitter-hours-edit.component';
import { FitterHoursComponent } from './pages/fitter-hours/fitter-hours.component';
import { FitterAbsenceComponent } from './pages/fitter-absence/fitter-absence.component';
import { FitterAbsenceNewComponent } from './pages/fitter-absence-new/fitter-absence-new.component';
import { FitterAbsenceFormComponent } from './partials/fitter-absence-form/fitter-absence-form.component';
import { FitterAbsenceEditComponent } from './pages/fitter-absence-edit/fitter-absence-edit.component';
import { FitterAbsenceCancelComponent } from './pages/fitter-absence-cancel/fitter-absence-cancel.component';


@NgModule({
  declarations: [FitterFormComponent, FitterNewComponent, FitterEditComponent, FittersComponent, FitterHoursAdvancedComponent, FitterHoursNewComponent, FitterHoursFormComponent, FitterHoursEditComponent, FitterHoursComponent, FitterAbsenceComponent, FitterAbsenceNewComponent, FitterAbsenceFormComponent, FitterAbsenceEditComponent, FitterAbsenceCancelComponent],
  imports: [
    CommonModule,
    BrowserModule, 
    FormsModule,
    WorkshopModule,
    CoreModule,
    FitterRoutingModule
  ]
})
export class FitterModule { }
