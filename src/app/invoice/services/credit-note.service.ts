import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CreditNote } from '../models/credit-note.model';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteService {

  /**
* Endpoint for http calls
*/
  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }

  createCreditNote(note: CreditNote): Observable<CreditNote> {


    if (!note) {
      throw new Error('credit note service: you must supply a credit note object for saving');
    }

    delete note.createdAt;
    delete note.updatedAt;

    if (note.id > 0) {
      throw new Error('credit note service: Cannot create a existing object');
    }

    delete note.id;
    return this.httpClient.post(this._endpoint + 'credit-note',
      JSON.stringify(note),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <CreditNote>data;
      }));
  }



  updateCreditNote(note: CreditNote): Observable<CreditNote> {


    if (!note) {
      throw new Error('credit note service: you must supply a credit note object for saving');
    }


    delete note.updatedAt;

    if (!note.id || note.id === -1) {
      throw new Error('credit note service: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'credit-note/' + note.id,
      JSON.stringify(note),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <CreditNote>data;
      }));
  }

  getCreditNotesByInvoiceId(invoiceId: number=-1) {
    if(!invoiceId || invoiceId === -1) {
      throw new Error('Must provide a invoiceId in getCreditNotesByInvoiceId');
    }

    return this.httpClient.get(this._endpoint + 'credit-note?filter=invoiceId||eq||' + invoiceId);
  }

  createPDF(creditNoteId:number=-1, data: any) {
    data.invoicingInfo = environment.invoicing;
    return this.httpClient.post(this._endpoint + 'credit-note/pdf/' + creditNoteId,
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } });
  }

  emailCreditNote(creditNoteId: number, email: string, message: string) {

    if (creditNoteId === -1 || !creditNoteId) {
      throw new Error('Please provide valid creditNoteId in emailInvoices');
    }

    if (!email || email === '') {
      throw new Error('Please provide valid email in emailInvoices');
    }

    if (!message || message === '') {
      throw new Error('Please provide valid message in emailInvoices');
    }

    return this.httpClient.post(this._endpoint + 'credit-note/email/' + creditNoteId,
      JSON.stringify({
        creditNoteId: creditNoteId,
        toEmail: email,
        message: message,
        invoicingInfo: environment.invoicing,
      }),
      { headers: { 'Content-Type': 'application/json' } });
  }


}
