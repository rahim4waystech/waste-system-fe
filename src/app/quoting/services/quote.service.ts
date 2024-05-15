import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from 'src/app/order/models/quote.model';
import { map } from 'rxjs/operators';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { QuoteStatus } from '../models/quote-status.model';
import { QuoteStatusHistory } from '../models/quote-status-history.model';
import { Account } from 'src/app/order/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

   /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

 /**
  * Get a quote from the backend by id
  *
  * @param id number id of quote to get
  *
  * @returns Observable<Quote>
  */
 getQuoteById(id: number): Observable<Quote> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('QuoteService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'quote/' + id).pipe(map((value: any) => {
    return <Quote>value;
 }));
}

count(){
  return this.httpClient.get(this._endpoint + 'quote?fields=id');
}

countByMonthAndYear(month: string, year: string) {
  return this.httpClient.get(this._endpoint + 'quote?fields=id&filter=quoteNumber||cont||' + 'quote-' + month + '-' + year);
}

/**
 * creates a quote in the backend based on quote object.
 * @param Quote quote object.
 *
 * @returns Observable<Quote>
 */
createQuote(quote: Quote): Observable<Quote> {


  if(!quote) {
    throw new Error('quote service: you must supply a quote object for saving');
  }

  delete quote.createdAt;
  delete quote.updatedAt;

  if(quote.validFrom === '') {
    quote.validFrom = null;
  }

  if(quote.validTo === '') {
    quote.validTo = null;
  }

  if(quote.closedOn === '') {
    quote.closedOn = null;
  }

  if(quote.quoteNumber === null) {
    quote.quoteNumber = '';
  }

  if(quote.description === null) {
    quote.description = '';
  }


  if(quote.id > 0) {
    throw new Error('quote service: Cannot create a existing object');
  }

  delete quote.id;
  return this.httpClient.post(this._endpoint + 'quote',
  JSON.stringify(quote),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Quote>data;
  }));
}

createQuoteStatusHistory(status: QuoteStatusHistory): Observable<QuoteStatusHistory> {


  if(!status) {
    throw new Error('quote service: you must supply a quote status object for saving');
  }

  delete status.createdAt;
  delete status.updatedAt;
  delete status.user;
  delete status.createdBy;

  if(status.id > 0) {
    throw new Error('quote service: Cannot create a existing object');
  }

  delete status.id;
  return this.httpClient.post(this._endpoint + 'quote-status-history',
  JSON.stringify(status),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <QuoteStatusHistory>data;
  }));
}

getQuoteStatusHistoryForQuoteId(quoteId: number) {
  if(!quoteId || quoteId === -1) {
    throw new Error('Quote id must be supplied in getQuoteStatusHistoryForQuoteId');
  }

  return this.httpClient.get(this._endpoint + 'quote-status-history?filter=quoteId||eq||' + quoteId).pipe(map((data) => {
    return <QuoteStatusHistory[]>data;
  }));
}

/**
 * updates a quote in the backend based on quote object.
 * @param quote quote object.
 *
 * @returns Observable<Quote>
 */
updateQuote(quote: Quote): Observable<Quote> {


  if(!quote) {
    throw new Error('quote service: you must supply a quote object for saving');
  }

  delete quote.createdAt;
  delete quote.updatedAt;

  if(quote.account === null) {
    quote.account = new Account();
  }


  if(!quote.id || quote.id === -1) {
    throw new Error('quote service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'quote/' + quote.id,
  JSON.stringify(quote),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Quote>data;
  }));
}


createBulkQuoteLines(quoteLines: QuoteLine[]): Observable<QuoteLine[]> {

  if (!quoteLines) {
    throw new Error('You must provide quotelines for createBulkQuoteLines');
  }

  quoteLines.forEach((line) => {
    if (line.quoteId === -1 || line.quoteId === undefined || line.quoteId === null) {
      throw new Error('quoteline quoteId must be set');
    }

    if(line.id === -1) {
      delete line.id;
    }

    delete line.createdAt;
    delete line.updatedAt;
  })

  return this.httpClient.post(this._endpoint + 'quote-line/bulk', { "bulk": quoteLines }).pipe(map((value: any) => {
    return <QuoteLine[]>value;
  }));
}

getQuoteLinesByQuoteId(quoteId: number): Observable<QuoteLine[]> {
  return this.httpClient.get(this._endpoint + 'quote-line?filter=quoteId||eq||' + quoteId).pipe(map((data) => {
    return <QuoteLine[]>data;
  }));
}

getQuotesBySites(siteIds: number[]): Observable<Quote[]> {

  if(!siteIds || siteIds.length === 0) {
    throw new Error('getQuotesBySites must have at least one site id');
  }
  return this.httpClient.get(this._endpoint + 'quote?filter=accountId||in||' + siteIds.join(',') + '&filter=quoteStatusId||eq||2').pipe(map((data) => {
    return <Quote[]>data;
  }));
}

deleteQuoteLineById(quoteLineId: number) {
  if(!quoteLineId || quoteLineId <= 0) {
    throw new Error('You must provide a valid quoteline id when deleting');
  }

  return this.httpClient.delete(this._endpoint + 'quote-line/' + quoteLineId);
}

  getQuotePdf(id: number, invoiceInfo: any) {
    if(!id || id === -1) {
      throw new Error('You must provide a valid quote id when getting pdf');
    }

    return this.httpClient.post(this._endpoint + 'quote/pdf/' + id,   JSON.stringify({pdfSettings: invoiceInfo}),
    {headers: {'Content-Type': 'application/json'}});
  }

  getPdfContents(id: number, invoiceInfo: any) {
    if(!id || id === -1) {
      throw new Error('You must provide a valid quote id when getting pdf');
    }

    return this.httpClient.post(this._endpoint + 'quote/pdfContent/' + id,   JSON.stringify({pdfSettings: invoiceInfo}),
    {headers: {'Content-Type': 'application/json'}});
  }

}
