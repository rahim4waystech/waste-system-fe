import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipTicketRoutingModule } from './tip-ticket-routing.module';
import { TipTicketsComponent } from './pages/tip-tickets/tip-tickets.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '../core/core.module';
import { TipTicketFormComponent } from './partials/tip-ticket-form/tip-ticket-form.component';
import { TipTicketNewComponent } from './pages/tip-ticket-new/tip-ticket-new.component';
import { TipTicketEditComponent } from './pages/tip-ticket-edit/tip-ticket-edit.component';
import { TipTicketDeleteComponent } from './pages/tip-ticket-delete/tip-ticket-delete.component';
import { NgSelectConfig, NgSelectModule, ɵs } from '@ng-select/ng-select';


@NgModule({
  declarations: [TipTicketsComponent, TipTicketFormComponent, TipTicketNewComponent, TipTicketEditComponent, TipTicketDeleteComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    NgSelectModule,
    TipTicketRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class TipTicketModule { }
