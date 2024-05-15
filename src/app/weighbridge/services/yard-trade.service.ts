import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { YardTrade } from '../models/yard-trade.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { YardTradePricing } from '../models/yard-trade-pricing.model';

@Injectable({
  providedIn: 'root'
})
export class YardTradeService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

 generateTicket(data: any) {
  return this.httpClient.post(this._endpoint + 'yard-trade/ticket',JSON.stringify(data),
  {headers: {'Content-Type': 'application/json'}});

}

generateTicketOut(data: any) {
  return this.httpClient.post(this._endpoint + 'yard-trade/ticket-out',JSON.stringify(data),
  {headers: {'Content-Type': 'application/json'}});

}


 createYardTrade(yardTrade: YardTrade): Observable<YardTrade> {


  if(!yardTrade) {
    throw new Error('yard trade service: you must supply a yard trade object for saving');
  }

  delete yardTrade.createdAt;
  delete yardTrade.updatedAt;

  if(yardTrade.id > 0) {
    throw new Error('yard trade service: Cannot create a existing object');
  }

  delete yardTrade.id;
  delete yardTrade.customer.depot;
  yardTrade.depot = {id: yardTrade.depotId} as any;
  return this.httpClient.post(this._endpoint + 'yard-trade',
  JSON.stringify(yardTrade),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <YardTrade>data;
  }));
}

getYardTradeById(id: number): Observable<YardTrade> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('yard trade service: Id must be a valid number');
  } else {
    return this.httpClient.get(this._endpoint + 'yard-trade/' + id).pipe(map((value: any) => {
       return <YardTrade>value;
    }));
  }
}

getYardTradeByIdExpanded(id: number): Observable<YardTrade> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('yard trade service: Id must be a valid number');
  } else {
    return this.httpClient.get(this._endpoint + 'yard-trade/' + id + '?join=yardTradePricing').pipe(map((value: any) => {
       return <YardTrade>value;
    }));
  }
}

deleteAllPricingForYardTradeId(id: number) {
  if (!id) {
    throw new Error('You must provide orderId for deleteAllForYardTradeId');
  }

  return this.httpClient.request('delete', this._endpoint + 'yard-trade-pricing/deleteAllByYardTradeId/' + id);

}

count(){
  return this.httpClient.get(this._endpoint + 'yard-trade?fields=id');
}

assignYardTradeToInvoice(yardTrade: YardTrade[], extra:any={}) {
  if(!yardTrade){
    throw new Error('You must supply a yard trade for assignYardTradeToInvoice');
  }

  return this.httpClient.post(this._endpoint + 'invoice/assignYardTrade', {"bulk": yardTrade});

}

updateYardTrade(yardTrade: YardTrade): Observable<YardTrade> {


  
  if(!yardTrade) {
    throw new Error('yard trade service: you must supply a yard trade object for saving');
  }

  delete yardTrade.createdAt;
  delete yardTrade.updatedAt;
  delete yardTrade['yardTradePricing'];


  if(!yardTrade.id || yardTrade.id === -1) {
    throw new Error('yard trade service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'yard-trade/' + yardTrade.id,
  JSON.stringify(yardTrade),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <YardTrade>data;
  }));
}

createBulkPricing(pricing: YardTradePricing[]): Observable<YardTradePricing[]> {

  if (!pricing) {
    throw new Error('You must provide pricing for createBulkPricing');
  }

  pricing.forEach((line) => {
    if (line.id > 0) {
      throw new Error('price cannot be existing record on createBulkPricing');
    }

    if (line.yardTradeId === -1 || line.yardTradeId === undefined || line.yardTradeId === null) {
      throw new Error('price yardTradeId must be set on createBulkPricing');
    }

    delete line.id;
    delete line.createdAt;
    delete line.updatedAt;
  })

  return this.httpClient.post(this._endpoint + 'yard-trade-pricing/bulk', { "bulk": pricing }).pipe(map((value: any) => {
    return <YardTradePricing[]>value;
  }));
}
}
