import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { InvoiceService } from '../../services/invoice.service';
import { take, catchError } from 'rxjs/operators';
import { Invoice } from '../../models/invoice.model';
import * as moment from 'moment';
import { InvoiceStatus } from '../../models/invoice-status.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-email-invoice-modal',
  templateUrl: './email-invoice-modal.component.html',
  styleUrls: ['./email-invoice-modal.component.scss']
})
export class EmailInvoiceModalComponent implements OnInit {
  @Input()
  selectedInvoices: any = {invoices: []};
  message: string = `Hi,
Please see attached your request invoices

Thanks,
Accounts department`;

  @Input()
  email: any = {email:''};

  @Input()
  mode: string = 'invoices';

  @Input()
  showPods: any = {showPods: false};
  constructor(private modalService: ModalService,
    private accountService: AccountService,
    private invoiceService: InvoiceService) { }

  ngOnInit(): void {
   
  }

  cancel() {
    this.modalService.close('emailInvoiceModal');
  }

  send() {
    if(this.email === '' || this.message === '') {
      alert('You must supply a valid email and message');
      return;
    }

    const invoiceIds = [];

    this.selectedInvoices.invoices.forEach((invoice) => {
      invoiceIds.push(invoice.id);
    })

    this.invoiceService.emailInvoices(invoiceIds, this.email.email, this.message, this.showPods.showPods)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not email invoices. Please ensure email address is correct.');
      return e;
    }))
    .subscribe(() => {
      this.saveInvoices();
    })

  }

  saveInvoices() {

    this.selectedInvoices.invoices.forEach((invoice: Invoice) => {

      // if open set invoice date if not don't
      if(invoice.invoiceStatusId === 1 && invoice.invoiceDate === null) {
        invoice.invoiceDate = moment().format('YYYY-MM-DD');
      }
      // set posted and close the invoice once printed
      invoice.emailed = true;
      invoice.emailedDate = moment().format('YYYY-MM-DD');
      invoice.invoiceStatusId = 2; //closed

      if(invoice.invoiceStatus === null || !invoice.invoiceStatus) {
        invoice.invoiceStatus = new InvoiceStatus();
      }
      invoice.invoiceStatus.id = 2; //closed

    })

    this.invoiceService.updateBulkInvoices(this.selectedInvoices.invoices)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update invoices. Please try again later');
      return e;
    }))
    .subscribe((data) => {
      if(this.mode === 'generate') {
        window.location.href = '/job-signoff/land';
      } else {
        window.location.reload();
      }
    })
  }
}
