import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSignoffMaterialUpliftRoutingModule } from './job-signoff-material-uplift-routing.module';
import { JobSignoffMaterialUpliftComponent } from './pages/job-signoff-material-uplift/job-signoff-material-uplift.component';
import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MateralUpliftAddComponent } from './pages/materal-uplift-add/materal-uplift-add.component';
import { MaterialUpliftFormComponent } from './partials/material-uplift-form/material-uplift-form.component';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { ɵs } from 'angular-calendar';
import { MaterialUpliftEditComponent } from './pages/material-uplift-edit/material-uplift-edit.component';


@NgModule({
  declarations: [JobSignoffMaterialUpliftComponent, MateralUpliftAddComponent, MaterialUpliftFormComponent, MaterialUpliftEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    NgSelectModule,
    JobSignoffMaterialUpliftRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class JobSignoffMaterialUpliftModule { }
