import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { CoreModule } from '../core/core.module';
import { PrintInvoiceModalComponent } from './modals/print-invoice-modal/print-invoice-modal.component';
import { EmailInvoiceModalComponent } from './modals/email-invoice-modal/email-invoice-modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InvoiceEditComponent } from './pages/invoice-edit/invoice-edit.component';
import { AddInvoiceItemComponent } from './modals/add-invoice-item/add-invoice-item.component';
import { InvoiceRollbackComponent } from './pages/invoice-rollback/invoice-rollback.component';
import { InvoiceViewPdfComponent } from './pages/invoice-view-pdf/invoice-view-pdf.component';
import { InvoiceEmailHistoryComponent } from './pages/invoice-email-history/invoice-email-history.component';
import { AddCreditNoteInvoiceComponent } from './modals/add-credit-note-invoice/add-credit-note-invoice.component';
import { CreditNoteComponent } from './pages/credit-note/credit-note.component';
import { EmailCreditNoteModalComponent } from './modals/email-credit-note-modal/email-credit-note-modal.component';
import { ChangeCustomerModalComponent } from './modals/change-customer-modal/change-customer-modal.component';
import { NgSelectConfig, NgSelectModule, ɵs } from '@ng-select/ng-select';


@NgModule({
  declarations: [InvoicesComponent, PrintInvoiceModalComponent, EmailInvoiceModalComponent, InvoiceEditComponent, AddInvoiceItemComponent, InvoiceRollbackComponent, InvoiceViewPdfComponent, InvoiceEmailHistoryComponent, AddCreditNoteInvoiceComponent, CreditNoteComponent, EmailCreditNoteModalComponent, ChangeCustomerModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreModule,
    NgSelectModule,
    InvoiceRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ],
  exports: [
    EmailInvoiceModalComponent,
  ]
})
export class InvoiceModule { }
