import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { ErrorFourohfourComponent } from './pages/error-fourohfour/error-fourohfour.component';
import { PaginationService } from './services/pagination.service';
import { GridComponent } from './widgets/grid/grid.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuditLineComponent } from './widgets/audit-line/audit-line.component';
import { TabComponent } from './widgets/tabs/tab/tab.component';
import { TabsComponent } from './widgets/tabs/tabs.component';
import { ModalComponent } from './layout/modal/modal.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddressPickerComponent } from './widgets/address-picker/address-picker.component';
import { UploaderComponent } from './widgets/uploader/uploader.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { QrCodeModule } from 'ng-qrcode';
import { NgxKjuaModule } from 'ngx-kjua';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


import { QrGenComponent } from './widgets/qr-gen/qr-gen.component';
import { DvlaRegComponent } from './widgets/dvla-reg/dvla-reg.component';
import { DvlaVinComponent } from './widgets/dvla-vin/dvla-vin.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { DocumentUploadModalComponent } from './modals/document-upload-modal/document-upload-modal.component';
import { DiscussionComponent } from './widgets/discussion/discussion.component';
import { NewContactModalComponent } from './modals/new-contact-modal/new-contact-modal.component';
import { LeadAccountModalComponent } from './modals/lead-account-modal/lead-account-modal.component';
import { ImageViewModalComponent } from './modals/image-view-modal/image-view-modal.component';
import { FilebrowserComponent } from './widgets/filebrowser/filebrowser.component';
import { FormbuilderComponent } from './widgets/formbuilder/formbuilder.component';
import { IntervaliserComponent } from './widgets/intervaliser/intervaliser.component';
import { AssignStockComponent } from './modals/assign-stock/assign-stock.component';
import { PartsViewComponent } from './partials/parts-view/parts-view.component';
import { ContactModalComponent } from './modals/contact-modal/contact-modal.component';
import { GridColumnsManageComponent } from './modals/grid-columns-manage/grid-columns-manage.component';
import { GridSaveSearchComponent } from './modals/grid-save-search/grid-save-search.component';
import { BreadcrumbComponent } from './layout/breadcrumb/breadcrumb.component';
import { CompaniesHouseSearchComponent } from './widgets/companies-house-search/companies-house-search.component';

@NgModule({
  declarations: [HeaderComponent, ErrorFourohfourComponent, GridComponent, SidebarComponent, AuditLineComponent,TabComponent,
    TabsComponent,
    ModalComponent,
    AddressPickerComponent,
    UploaderComponent,
    QrGenComponent,
    DvlaRegComponent,
    DvlaVinComponent,
    ForbiddenComponent,
    DocumentUploadModalComponent,
    LeadAccountModalComponent,
    DiscussionComponent,
    NewContactModalComponent,
    ImageViewModalComponent,
    FilebrowserComponent,
    FormbuilderComponent,
    IntervaliserComponent,
    PartsViewComponent,
    AssignStockComponent,
    ContactModalComponent,
    GridColumnsManageComponent,
    GridSaveSearchComponent,
    BreadcrumbComponent,
    CompaniesHouseSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    QrCodeModule,
    NgxKjuaModule,
  ],
  providers: [
    PaginationService,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    ErrorFourohfourComponent,
    GridComponent,
    AuditLineComponent,
    TabComponent,
    TabsComponent,
    LeadAccountModalComponent,
    ModalComponent,
    AddressPickerComponent,
    CompaniesHouseSearchComponent,
    UploaderComponent,
    NewContactModalComponent,
    QrGenComponent,
    DvlaRegComponent,
    PartsViewComponent,
    IntervaliserComponent,
    DocumentUploadModalComponent,
    ContactModalComponent,
    ImageViewModalComponent,
    DvlaVinComponent,
    DiscussionComponent,
    AssignStockComponent,
  ]
})
export class CoreModule { }
