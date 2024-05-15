import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { InvoiceEditComponent } from './pages/invoice-edit/invoice-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { InvoiceRollbackComponent } from './pages/invoice-rollback/invoice-rollback.component';
import { InvoiceViewPdfComponent } from './pages/invoice-view-pdf/invoice-view-pdf.component';
import { InvoiceEmailHistoryComponent } from './pages/invoice-email-history/invoice-email-history.component';
import { CreditNoteComponent } from './pages/credit-note/credit-note.component';


const routes: Routes = [
  {
    path: 'invoices',
    component: InvoicesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/edit/:id',
    component: InvoiceEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/rollback/:id',
    component: InvoiceRollbackComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/pdf/:id',
    component: InvoiceViewPdfComponent,
  },
  {
    path: 'invoices/email-history',
    component: InvoiceEmailHistoryComponent,
  },
  {
    path: 'credit-note',
    component: CreditNoteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
