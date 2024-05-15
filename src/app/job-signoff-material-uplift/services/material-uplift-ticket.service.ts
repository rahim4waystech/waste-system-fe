import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MaterialUpliftTicket } from '../../order/models/material-uplift-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialUpliftTicketService {

  /**
  * Endpoint for http calls
  */
   private _endpoint: string = environment.api.endpoint;


   constructor(private httpClient: HttpClient) { }

   getMaterialUpliftTicketById(id: number): Observable<MaterialUpliftTicket> {

    if(id <= 0 || id === null || id === undefined) {
      throw new Error('MaterialUpliftTicketService: Id must be a valid number');
    }
 
   return this.httpClient.get(this._endpoint + 'material-uplift-ticket/' + id).pipe(map((value: any) => {
      return <MaterialUpliftTicket>value;
   }));
  }
  
  getAllTicketsByJobId(jobId: number) {
    if(jobId <= 0 || jobId === null || jobId === undefined) {
      throw new Error('MaterialUpliftTicketService: Id must be a valid number');
    }
  
   return this.httpClient.get(this._endpoint + 'material-uplift-ticket?filter=jobId||eq||' + jobId + '&filter=deleted||eq||0').pipe(map((value: any) => {
      return <MaterialUpliftTicket[]>value;
   }));
   }

  createMaterialUpliftTicket(ticket: MaterialUpliftTicket): Observable<MaterialUpliftTicket> {


    if(!ticket) {
      throw new Error('material uplift ticket service: you must supply a ticket object for saving');
    }
  
    delete ticket.createdAt;
    delete ticket.updatedAt;
  
    if(ticket.id > 0) {
      throw new Error('material uplift ticket service: Cannot create a existing object');
    }
  
    delete ticket.id;
    return this.httpClient.post(this._endpoint + 'material-uplift-ticket',
    JSON.stringify(ticket),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <MaterialUpliftTicket>data;
    }));
  }
  
  updateMaterialUpliftTicket(ticket: MaterialUpliftTicket): Observable<MaterialUpliftTicket> {
  
  
    if(!ticket) {
      throw new Error('material uplift ticket service: you must supply a ticket object for saving');
    }
  
    
    delete ticket.updatedAt;
  
    if(!ticket.id || ticket.id === -1) {
      throw new Error('material uplift ticket service: Cannot update an record without id');
    }
  
    return this.httpClient.put(this._endpoint + 'material-uplift-ticket/' + ticket.id,
    JSON.stringify(ticket),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <MaterialUpliftTicket>data;
    }));
  }

  bulkUpdateTickets(tickets: MaterialUpliftTicket[]) {
    tickets.forEach((ticket: MaterialUpliftTicket) => {
      delete ticket.updatedAt;
      delete ticket.createdAt;

      if(ticket.id === -1) {
        delete ticket.id;
      }
    });
  
    return this.httpClient.post(this._endpoint + 'material-uplift-ticket/bulk', {bulk: tickets});
  }

  getGrid(page: number=1, amount:number=1, filters:any={}) {
    return this.httpClient.get(this._endpoint + 'material-uplift-ticket/grid?page=' + page + '&limit=' + amount + '&filters=' + encodeURIComponent(JSON.stringify(filters)));
  }
  
}
