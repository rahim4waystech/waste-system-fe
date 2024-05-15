import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { CustomerDetails } from 'src/app/account/models/customer-details.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { InvoiceStatus } from 'src/app/invoice/models/invoice-status.model';
import { Invoice } from 'src/app/invoice/models/invoice.model';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-invoice-modal',
  templateUrl: './create-invoice-modal.component.html',
  styleUrls: ['./create-invoice-modal.component.scss']
})
export class CreateInvoiceModalComponent implements OnInit {

  @Input()
  jobs: Job[] = [];

  ticketType:number = 1;
  date: string = '';
  ids: number[] = [];
  invoiceNumber: number = -1;
  nextId:number = -1;

  invoice: Invoice = new Invoice();

  confirmation:boolean = false;

  customerDetails: CustomerDetails = new CustomerDetails();

  showPODS: boolean = false;

   buttonClicked: boolean = false;

  @Input()
  email: any = {email:''};
  message: string = `Hi,
Please see attached your request invoices

Thanks,
Accounts department`;

  sendEmail: boolean = false;
  emailFailed: boolean = false;

  invoiceResults: Invoice[] = [];
  constructor(private modalService: ModalService,
    private jobService: JobService,
    private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.setNextNumber();
    this.customerDetails.invoicePeriodId = 1;
  }

  setNextNumber() {
    this.invoiceService.getNextNumber()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not get next number for invoice');
      this.buttonClicked = false;
      return e;
    }))
    .subscribe((data) => {
      this.invoiceNumber = +data;
      this.nextId = +data;
      this.buttonClicked = false;
    })
  }

  cancel() {
     this.modalService.close('createInvoiceModal');
  }

  preview() {
    if(this.customerDetails.invoiceMethodId === -1 || this.customerDetails.invoicePeriodId === -1 || this.date === '') {
      alert('You must complete all fields');
      return;
    }

      this.invoiceService.previewInvoice(this.jobs, {
        customerDetails: this.customerDetails,
        ticketType: this.ticketType,
      date: this.date,
        confirmation: this.confirmation,
        invoiceNumber:-1,
        pdfSettings: environment.invoicing,
        pods: this.showPODS,
        type: 1,
      })
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('could not create invoice');
        return e;
      }))
      .subscribe((data:any) => {
        window.open(environment.publicUrl + data.fileName, '_blank');
        // // refresh the page so grid is up to date
        // window.location.reload();
      })
    }

  save() {


    if(this.customerDetails.invoiceMethodId === -1 || this.customerDetails.invoicePeriodId === -1 || this.date === '') {
      alert('You must complete all fields');
      return;
    }

    if(this.emailFailed) {
      this.send(this.invoiceResults);
    }

    // don't allow double clicks
    if(this.buttonClicked) {
      return;
    }


    this.jobs.forEach((job: Job) => {
      job.jobManagerSignOff = true;
     });

     this.invoiceService.getInvoiceById(this.invoiceNumber)
     .pipe(take(1))
     .pipe(catchError((e) => {

      this.buttonClicked = true;
      // 404 invoice id is open
      this.generate();

       return e;
     }))
     .subscribe((data) => {
       alert('Cannot use this invoice number as a invoice already exists. Click OK to generate next number.');
       this.setNextNumber();
       this.buttonClicked = false;
     })

  }

  generate() {
    this.jobService.bulkUpdateJob(this.jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      this.buttonClicked = false;
      alert('Could not updated jobs in database');
      return e;
    }))
    .subscribe(() => {
     this.invoiceService.assignJobsToInvoice(this.jobs, {
       customerDetails: this.customerDetails,
       ticketType: this.ticketType,
       date: this.date,
       confirmation: this.confirmation,
       invoiceNumber:  this.invoiceNumber === this.nextId ? -1 : this.invoiceNumber,
     })
     .pipe(take(1))
     .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
       alert('could not create invoice');
       this.buttonClicked = false;
       return e;
     }))
     .subscribe((data: any) => {
       alert('Invoice has been created');
       this.buttonClicked = false;
       this.invoiceResults = data;
       this.saveInvoices(data);
       this.setNextNumber();
      //  this.cancel();
     })
    })
  }


  createPDFFile(invoices: Invoice[]) {

    const data =  {
      "invoiceIds": invoices.map(i => i.id),
      "type": 1,
      "pods": this.showPODS,
      "tipchecks": false,
    }

    this.invoiceService.createPDFBatchFile(data)
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      this.buttonClicked = false;
      alert('Could not generate invoice please try again later.');
      return e;
    }))
    .subscribe((data:any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
      if(this.sendEmail) {
          this.send(invoices);
          this.buttonClicked = false;
      } else {
        localStorage.setItem('WS_JOB_MANAGER_SIGNOFF_LAND_SELECTED', JSON.stringify([]));
        window.location.href = '/invoices';
        this.buttonClicked = false;
      }
    })
  }

  saveInvoices(invoices: Invoice[]) {
    invoices.forEach((invoice: Invoice) => {
          // if open set invoice date if not don't
    if(invoice.invoiceStatusId === 1 && invoice.invoiceDate === null) {
      invoice.invoiceDate = moment().format('YYYY-MM-DD');
    }
    // set posted and close the invoice once printed
    invoice.posted = true;
    invoice.postedDate = moment().format('YYYY-MM-DD');
    invoice.invoiceStatusId = 2; //closed

    if(invoice.invoiceStatus === null || !invoice.invoiceStatus) {
      invoice.invoiceStatus = new InvoiceStatus();
    }

    if(this.sendEmail) {
      invoice.emailed = true;
      invoice.emailedDate = moment().format('YYYY-MM-DD');
    }
    invoice.invoiceStatus.id = 2; //closed
    });



    this.invoiceService.updateBulkInvoices(invoices)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update invoices. Please try again later');
      this.buttonClicked = false;
      return e;
    }))
    .subscribe((data) => {
      this.createPDFFile(invoices);
      this.buttonClicked = false;
    })
  }

  send(invoices: Invoice[]) {
    if(this.email === '' || this.message === '') {
      alert('You must supply a valid email and message');
      return;
    }


    const invoiceIds = invoices.map(i => i.id);

    this.invoiceService.emailInvoices(invoiceIds, this.email.email, this.message, this.showPODS)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not email invoices. Please ensure email address is correct.');
      this.buttonClicked = false;
    return e;
    }))
    .subscribe(() => {
      localStorage.setItem('WS_JOB_MANAGER_SIGNOFF_LAND_SELECTED', JSON.stringify([]));
      window.location.href = '/invoices';
      this.buttonClicked = false;
    })

  }

  getSummaryDetails() {

    let price = 0;
    let qty = 0;

    this.jobs.forEach((job: any) => {
      qty += job.qty;
      price += job.order.orderLines[0].price * job.qty;
    });

    // check if float if so format to 2 decimals
    if(qty % 1 != 0) {
      qty = <any>qty.toFixed(2);
    }

    return {total: this.jobs.length, qty: qty, price:price.toFixed(2)};
  }

}
