import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OrderProvision } from '../models/order-provision.model';

@Injectable({
  providedIn: 'root'
})
export class OrderProvisionService {

    /**
  * Endpoint for http calls
  */
     private _endpoint: string = environment.api.endpoint;


     constructor(private httpClient: HttpClient) { }

     deleteSingleByOrderIdAndDate(orderId: number=-1, date:string='') {
      return this.httpClient.post(this._endpoint + 'order-provision/deleteSingleByOrderId/' + orderId + '/' + date, {});
     }

     updateSingleToAllocatedByOrderIdAndDate(orderId: number=1, date:string='') {
      return this.httpClient.post(this._endpoint + 'order-provision/updateSingleToAllocatedByOrderIdAndDate/' + orderId + '/' + date, {});
     }


     createOrderProvisionsBulk(provisions: OrderProvision[]): Observable<OrderProvision[]> {

      if (!provisions) {
        throw new Error('You must provide provisions for createOrderProvisions');
      }
    
      provisions.forEach((line) => {

        delete line.id;
      
    
        delete line.createdAt;
        delete line.updatedAt;
        delete line.order;
      })

      console.log(provisions);
    
      return this.httpClient.post(this._endpoint + 'order-provision/bulk', { "bulk": provisions }).pipe(map((value: any) => {
        return <OrderProvision[]>value;
      }));
    
    }
     createOrderProvision(orderProvision: OrderProvision): Observable<OrderProvision> {

      if (!orderProvision) {
        throw new Error('order provision service: you must supply a order provision object for saving');
      }
  
      delete orderProvision.createdAt;
      delete orderProvision.updatedAt;
  
      delete orderProvision.id;

      return this.httpClient.post(this._endpoint + 'order-provision',
        JSON.stringify(orderProvision),
        { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
          return <OrderProvision>data;
        }));
    }
    
    updateOrderProvision(orderProvision: OrderProvision): Observable<OrderProvision> {


      if (!orderProvision) {
        throw new Error('order provision service: you must supply a order provision object for saving');
      }
  
      delete orderProvision.createdAt;
      delete orderProvision.updatedAt;

  
      if (!orderProvision.id || orderProvision.id === -1) {
        throw new Error('order provision service: Cannot update an record without id');
      }
  
      return this.httpClient.put(this._endpoint + 'order-provision/' + orderProvision.id,
        JSON.stringify(orderProvision),
        { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
          return <OrderProvision>data;
        }));
    }
}
