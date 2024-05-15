import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpportunitiesRoutingModule } from './opportunities-routing.module';
import { OpportunitiesComponent } from './pages/opportunities/opportunities.component';
import { AddOpportunitiesComponent } from './pages/add-opportunities/add-opportunities.component';
import { EditOpportunitiesComponent } from './pages/edit-opportunities/edit-opportunities.component';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { OpportunityFormComponent } from './partials/opportunity-form/opportunity-form.component';
import { OppAccountModalComponent } from './modals/opp-account-modal/opp-account-modal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [OpportunitiesComponent, AddOpportunitiesComponent, EditOpportunitiesComponent, OpportunityFormComponent, OppAccountModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    NgMultiSelectDropDownModule.forRoot(),
    OpportunitiesRoutingModule
  ]
})
export class OpportunitiesModule { }
