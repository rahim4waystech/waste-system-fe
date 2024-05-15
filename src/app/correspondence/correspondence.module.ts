import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorrespondenceRoutingModule } from './correspondence-routing.module';
import { CorrespondenceComponent } from './pages/correspondence/correspondence.component';
import { CorrespondenceGridComponent } from './partials/correspondence-grid/correspondence-grid.component';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CorrespondenceAddModalComponent } from './modals/correspondence-add-modal/correspondence-add-modal.component';
import { CorrespondenceEditModalComponent } from './modals/correspondence-edit-modal/correspondence-edit-modal.component';
import { CorrespondenceSendEmailModalComponent } from './modals/correspondence-send-email-modal/correspondence-send-email-modal.component';


@NgModule({
  declarations: [CorrespondenceComponent, CorrespondenceGridComponent, CorrespondenceAddModalComponent, CorrespondenceEditModalComponent, CorrespondenceSendEmailModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    CorrespondenceRoutingModule
  ],
  exports: [
    CorrespondenceGridComponent,
  ]
})
export class CorrespondenceModule { }
