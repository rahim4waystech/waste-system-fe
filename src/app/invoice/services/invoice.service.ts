import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../models/invoice.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaxType } from '../models/tax-type.model';
import { InvoiceItem } from '../models/invoice-item.model';
import { Job } from 'src/app/timeline-skip/models/job.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }

  /**
  * Get a invoice from the backend by id
  *
  * @param id number id of invoice to get
  *
  * @returns Observable<Invoice>
  */
  getInvoiceById(id: number): Observable<Invoice> {

    if (id <= 0 || id === null || id === undefined) {
      throw new Error('InvoiceService: Id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'invoice/' + id).pipe(map((value: any) => {
      return <Invoice>value;
    }));
  }

  assignJobToInvoice(job: Job) {
    if(!job) {
      throw new Error('You must supply a job for assignJobToInvoice');
    }

    return this.httpClient.post(this._endpoint + 'invoice/assignJob', JSON.stringify(job));

  }

  getAvaIds() {

    // This should really be a sql query of sorts.
    return this.httpClient.get(this._endpoint + 'invoice?fields=id')
    .pipe(map((data:any[]) => {
      const ids = data.map(d => d.id);

      const lastId = ids[ids.length - 1];
      const lostIds = [];

      for(let i = 1; i <= lastId; i++) {
        const idFound = ids.indexOf(i) !== -1;

        if(!idFound) {
          lostIds.push(i);
        }
      }

      return lostIds;
    }));
  }

  rollback(id: number) {
    if(!id || id === -1) {
      throw new Error('You must supply a id for invoice rollback');
    }

    return this.httpClient.post(this._endpoint + 'invoice/rollback/' + id, JSON.stringify({}));

  }

  findInvoiceByTicketNoReport(ticketNo: string='') {
    return this.httpClient.get(this._endpoint + 'invoice-item/ticket-matches/' + ticketNo);
  }

  assignJobsToInvoice(jobs: Job[], extra:any={}) {
    if(!jobs) {
      throw new Error('You must supply a jobs for assignJobsToInvoice');
    }

    return this.httpClient.post(this._endpoint + 'invoice/assignJobs', {"bulk": jobs, "extra": extra});

  }

  getNextNumber() {
    return this.httpClient.get(this._endpoint + 'invoice?fields=id&sort=id,DESC')
    .pipe(map((data: any) => {

      if(data[0]){
        return data[0].id + 1;
      }
      else{
        return 1;
      }
      
    }))
  }

  previewInvoice(jobs: Job[], extra:any={}) {
    if(!jobs) {
      throw new Error('You must supply a jobs for previewInvoice');
    }

    return this.httpClient.post(this._endpoint + 'invoice/preview', {"bulk": jobs, "extra": extra});

  }

  createPDFBatchFile(data: any) {
    data.pdfSettings = environment.invoicing;
    return this.httpClient.post(this._endpoint + 'invoice/batchPDF/',
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } });
}

  emailInvoices(invoiceIds: any, email: string, message: string, showPods: boolean = false) {

    if (invoiceIds.length === 0 || !invoiceIds) {
      throw new Error('Please provide valid invoiceIds in emailInvoices');
    }

    if (!email || email === '') {
      throw new Error('Please provide valid email in emailInvoices');
    }

    if (!message || message === '') {
      throw new Error('Please provide valid message in emailInvoices');
    }

    return this.httpClient.post(this._endpoint + 'invoice/email/',
      JSON.stringify({
        invoiceIds: invoiceIds,
        toEmail: email,
        message: message,
        pods: showPods,
        invoicingInfo: environment.invoicing,
      }),
      { headers: { 'Content-Type': 'application/json' } });
  }

  /**
 * updates a invoice in the backend based on invoice object.
 * @param invoice invoice object.
 *
 * @returns Observable<Invoice>
 */
  updateInvoice(invoice: Invoice): Observable<Invoice> {


    if (!invoice) {
      throw new Error('invoice service: you must supply a invoice object for saving');
    }

    delete invoice.createdAt;
    delete invoice.updatedAt;

    if (!invoice.id || invoice.id === -1) {
      throw new Error('invoice service: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'invoice/' + invoice.id,
      JSON.stringify(invoice),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <Invoice>data;
      }));
  }

  updateBulkInvoices(invoices: Invoice[]): Observable<Invoice[]> {

    if (!invoices) {
      throw new Error('You must provide invoices for updateBulkInvoices');
    }

    invoices.forEach((line) => {
      delete line.createdAt;
      delete line.updatedAt;
      if(!line.orderType) {
        line.orderType = {id: -1} as any;
      }
    })

    return this.httpClient.post(this._endpoint + 'invoice/bulk', { "bulk": invoices }).pipe(map((value: any) => {
      return <Invoice[]>value;
    }));
  }

  getAllTaxTypes(): Observable<TaxType[]> {
    return this.httpClient.get(this._endpoint + 'tax-type').pipe(map((value: any) => {
      return <TaxType[]>value;
    }));
  }

  getAllInvoiceItemsByInvoiceId(invoiceId: number): Observable<InvoiceItem[]> {

    if(!invoiceId || invoiceId === -1) {
      throw new Error('Invoice id must be valid in getAllInvoiceItemsByInvoiceId');
    }

    return this.httpClient.get(this._endpoint + 'invoice-item?filter=invoiceId||eq||' + invoiceId).pipe(map((value: any) => {
      return <InvoiceItem[]>value;
    }));
  }

  getAllInvoiceItemsByInvoiceIdExpanded(invoiceId: number): Observable<InvoiceItem[]> {

    if(!invoiceId || invoiceId === -1) {
      throw new Error('Invoice id must be valid in getAllInvoiceItemsByInvoiceIdExpanded');
    }

    return this.httpClient.get(this._endpoint + 'invoice-item?filter=invoiceId||eq||' + invoiceId + '&join=job&join=job.jobAssignment&join=orderLine').pipe(map((value: any) => {
      return <InvoiceItem[]>value;
    }));
  }

  getAllInvoiceItemsByJobId(jobId: number): Observable<InvoiceItem[]> {

    if(!jobId || jobId === -1) {
      throw new Error('Job id must be valid in getAllInvoiceItemsByJobId');
    }

    return this.httpClient.get(this._endpoint + 'invoice-item?filter=jobId||eq||' + jobId).pipe(map((value: any) => {
      return <InvoiceItem[]>value;
    }));
  }

  deleteInvoiceItemById(invoiceId: number) {
    if(!invoiceId || invoiceId === -1) {
      throw new Error('You must provide a valid id for deleting in deleteInvoiceItemById');
    }
    return this.httpClient.delete(this._endpoint + 'invoice-item/' + invoiceId);
  }

  createBulkInvoiceItems(invoiceItems: InvoiceItem[]): Observable<InvoiceItem[]> {

    if (!invoiceItems) {
      throw new Error('You must provide invoiceItems for createBulkInvoiceItems');
    }

    invoiceItems.forEach((line) => {

      if(line.id === -1) {
        delete line.id;
      }

      delete line.createdAt;
      delete line.updatedAt;
    })

    return this.httpClient.post(this._endpoint + 'invoice-item/bulk', { "bulk": invoiceItems }).pipe(map((value: any) => {
      return <InvoiceItem[]>value;
    }));
  }

  findInvoiceItemForJobId(jobId: number=-1) {
    if(!jobId || jobId === -1) {
      throw new Error('You must supply a job id for findInvoiceItemForJobId')
    }

    return this.httpClient.get(this._endpoint + 'invoice-item?filter=jobId||eq||' + jobId + '&limit=1');
  }

  findInvoiceItemsForJobs(jobs: number[]) {
    return this.httpClient.get(this._endpoint + 'invoice-item?filter=jobId||in||' + jobs.join(','));
  }

  getAllInvoicesByInvoiceIds(ids: number[] = []) {
    return this.httpClient.get(this._endpoint + 'invoice?filter=id||in||' + ids.join(','));
  }
}
