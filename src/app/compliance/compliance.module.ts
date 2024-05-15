import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplianceRoutingModule } from './compliance-routing.module';
import { ComplianceComponent } from './pages/compliance/compliance.component';
import { FilesystemBarComponent } from './partials/filesystem-bar/filesystem-bar.component';
import { FilesystemBrowserComponent } from './partials/filesystem-browser/filesystem-browser.component';
import { UploadFileModalComponent } from './modals/upload-file-modal/upload-file-modal.component';
import { NewFolderModalComponent } from './modals/new-folder-modal/new-folder-modal.component';
import { NewFormModalComponent } from './modals/new-form-modal/new-form-modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [ComplianceComponent, FilesystemBarComponent, FilesystemBrowserComponent, UploadFileModalComponent, NewFolderModalComponent, NewFormModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    ComplianceRoutingModule
  ]
})
export class ComplianceModule { }
