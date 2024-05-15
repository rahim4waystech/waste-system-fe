import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/order/models/order.model';
import { environment } from 'src/environments/environment';
import { TipTicket } from '../models/tip-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TipTicketService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }



 getTipTicketById(id: number): Observable<TipTicket> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('TipTicketService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'tip-ticket/' + id).pipe(map((value: any) => {
     return <TipTicket>value;
  }));
 }

 getAllTicketsByJobId(jobId: number) {
  if(jobId <= 0 || jobId === null || jobId === undefined) {
    throw new Error('TipTicketService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'tip-ticket?filter=jobId||eq||' + jobId + '&filter=deleted||eq||0').pipe(map((value: any) => {
    return <TipTicket>value;
 }));
 }

 deleteTicketsByJobId(jobId: number) {
  if(jobId <= 0 || jobId === null || jobId === undefined) {
    throw new Error('TipTicketService: Id must be a valid number');
  }

  return this.httpClient.post(this._endpoint + 'tip-ticket/deleteAllByJobId/' + jobId, {});
 }

 bulkCreateTickets(tickets: TipTicket[]) {
   tickets.forEach((ticket: TipTicket) => {
     delete ticket.id;
     delete ticket.createdAt;
     delete ticket.updatedAt;
   });

   return this.httpClient.post(this._endpoint + 'tip-ticket/bulk', {bulk: tickets});
 }


 bulkUpdateTickets(tickets: TipTicket[]) {
  tickets.forEach((ticket: TipTicket) => {
    delete ticket.updatedAt;
  });

  return this.httpClient.post(this._endpoint + 'tip-ticket/bulk', {bulk: tickets});
}


 createTipTicket(ticket: TipTicket): Observable<TipTicket> {


  if(!ticket) {
    throw new Error('tip ticket service: you must supply a ticket object for saving');
  }

  delete ticket.createdAt;
  delete ticket.updatedAt;

  if(ticket.id > 0) {
    throw new Error('tip ticket service: Cannot create a existing object');
  }

  delete ticket.id;
  return this.httpClient.post(this._endpoint + 'tip-ticket',
  JSON.stringify(ticket),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <TipTicket>data;
  }));
}

updateTipTicket(ticket: TipTicket): Observable<TipTicket> {


  if(!ticket) {
    throw new Error('tip ticket service: you must supply a ticket object for saving');
  }

  
  delete ticket.updatedAt;

  if(!ticket.id || ticket.id === -1) {
    throw new Error('tip ticket service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'tip-ticket/' + ticket.id,
  JSON.stringify(ticket),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <TipTicket>data;
  }));
}

getGrid(page: number=1, amount:number=1, filters:any={}) {
  return this.httpClient.get(this._endpoint + 'tip-ticket/grid?page=' + page + '&limit=' + amount + '&filters=' + encodeURIComponent(JSON.stringify(filters)));
}

getTipTicketsByCollectionNumber(tipTicket: string='') {
  return this.httpClient.get(this._endpoint + 'tip-ticket?filter=collectionTicketNumber||cont||"' + tipTicket + '"');
}

regenTicketsFromOrder(order: Order) {
  return this.httpClient.post(this._endpoint + 'tip-ticket/regen-tickets',
  JSON.stringify(order),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <TipTicket>data;
  }));
}


}
