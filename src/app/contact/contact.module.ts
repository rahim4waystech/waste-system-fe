import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { CoreModule } from '../core/core.module';
import { ContactFormComponent } from './partials/contact-form/contact-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ContactNewComponent } from './pages/contact-new/contact-new.component';
import { ContactEditComponent } from './pages/contact-edit/contact-edit.component';
import { ContactAccountModalComponent } from './modals/contact-account-modal/contact-account-modal.component';


@NgModule({
  declarations: [ContactComponent, ContactFormComponent, ContactNewComponent, ContactEditComponent, ContactAccountModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    ContactRoutingModule
  ],
  exports:[
    ContactFormComponent
  ]
})
export class ContactModule { }
