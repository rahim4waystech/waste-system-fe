import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { catchError, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Invoice } from '../../models/invoice.model';
import * as moment from 'moment';
import { InvoiceStatus } from '../../models/invoice-status.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-print-invoice-modal',
  templateUrl: './print-invoice-modal.component.html',
  styleUrls: ['./print-invoice-modal.component.scss']
})
export class PrintInvoiceModalComponent implements OnInit {

  @Input()
  selectedInvoices: any = {invoices: []};

  invoiceType: number = 1;
  batched: boolean = true;
  pods: boolean = true;
  posted: boolean = true;

  @Input()
  email: any = {email:''};
  message: string = `Hi,
Please see attached your request invoices

Thanks,
Accounts department`;
  sendEmail: boolean = false;
  showTipCheck: boolean = false;
  account: Account = new Account();
  constructor(private invoiceService: InvoiceService,
    private accountService: AccountService,
    private modalService: ModalService) { }

  ngOnInit(): void {
  }


  print() {
    this.saveInvoices();
  }

  createPDFFile() {
    const invoiceIds = [];

    this.selectedInvoices.invoices.forEach((invoice) => {
      invoiceIds.push(invoice.id);
    })

    const data =  {
      "invoiceIds": invoiceIds,
      "type": this.invoiceType,
      "pods": this.pods,
      "tipchecks": this.showTipCheck,
    }

    this.invoiceService.createPDFBatchFile(data)
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not generate invoice please try again later.');
      return e;
    }))
    .subscribe((data:any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
      if(this.sendEmail) {
        this.send();
      } else {
        // refresh the page so grid is up to date
        window.location.reload();
      }
    })
  }

  saveInvoices() {

    this.selectedInvoices.invoices.forEach((invoice: Invoice) => {

      // if open set invoice date if not don't
      if(invoice.invoiceStatusId === 1 && invoice.invoiceDate === null) {
        invoice.invoiceDate = moment().format('YYYY-MM-DD');
      }

      // only post if set to posted
      if(this.posted) {
        // set posted and close the invoice once printed
        invoice.posted = true; 
        invoice.postedDate = moment().format('YYYY-MM-DD');
      }

      if(this.sendEmail) {
        invoice.emailed = true;
        invoice.emailedDate = moment().format('YYYY-MM-DD');
      }

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
      this.createPDFFile();
    })
  }

  cancel() {
    this.modalService.close('printInvoiceModal');
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

    this.invoiceService.emailInvoices(invoiceIds, this.email.email, this.message)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not email invoices. Please ensure email address is');
      return e;
    }))
    .subscribe(() => {
      window.location.reload();
    })

  }

}
