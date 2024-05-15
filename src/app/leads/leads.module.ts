import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './pages/leads/leads.component';
import { AddLeadsComponent } from './pages/add-leads/add-leads.component';
import { EditLeadsComponent } from './pages/edit-leads/edit-leads.component';
import { LeadFormComponent } from './partials/lead-form/lead-form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [LeadsComponent, AddLeadsComponent, EditLeadsComponent, LeadFormComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    NgMultiSelectDropDownModule.forRoot(),
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
