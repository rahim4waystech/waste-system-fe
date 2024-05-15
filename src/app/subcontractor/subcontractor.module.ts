import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubcontractorRoutingModule } from './subcontractor-routing.module';
import { SubcontractorComponent } from './pages/subcontractor/subcontractor.component';
import { CoreModule } from '../core/core.module';
import { SubcontractorFormComponent } from './partials/subcontractor-form/subcontractor-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SubcontractorNewComponent } from './pages/subcontractor-new/subcontractor-new.component';
import { SubcontractorEditComponent } from './pages/subcontractor-edit/subcontractor-edit.component';
import { SubcontractorDepotFromComponent } from './partials/subcontractor-depot-from/subcontractor-depot-from.component';
import { SubcontractorDepotAddComponent } from './pages/subcontractor-depot-add/subcontractor-depot-add.component';
import { SubcontractorDepotEditComponent } from './pages/subcontractor-depot-edit/subcontractor-depot-edit.component';


@NgModule({
  declarations: [SubcontractorComponent, SubcontractorFormComponent, SubcontractorNewComponent, SubcontractorEditComponent, SubcontractorDepotFromComponent, SubcontractorDepotAddComponent, SubcontractorDepotEditComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    SubcontractorRoutingModule
  ]
})
export class SubcontractorModule { }
