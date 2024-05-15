import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BatchService {


    /**
    * Endpoint for http calls
    */
  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }

  generateBatchExportFromInvoiceIds(invoiceIds: string[]) {
    if(!invoiceIds || invoiceIds.length === 0) {
      throw new Error('You must provide at least one invoice id in generateBatchExportFromInvoiceIds');
    }
    const data = {
      invoiceIds: invoiceIds,
      invoiceInfo: environment.invoicing
    }

    return this.httpClient.post(this._endpoint + 'batch/export/batch',
    JSON.stringify({
      data,
    }),
    {headers: {'Content-Type': 'application/json'}, responseType: 'text'});
  }

  generateBatchExportForDate(date: string) {
    if(!date || date === '') {
      throw new Error('You must provide a date in generateBatchExportFromInvoiceIds');
    }


    return this.httpClient.post(this._endpoint + 'batch/export/date',
    JSON.stringify({
      date: date,      
      invoiceInfo: environment.invoicing
    }),
    {headers: {'Content-Type': 'application/json'}});
  }

}
