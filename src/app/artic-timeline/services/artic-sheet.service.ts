import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticSheetService {

  //artic-sheet

  /**
  * Endpoint for http calls
  */
   private _endpoint: string = environment.api.endpoint;


   constructor(private httpClient: HttpClient) { }

   parseSheet(data:string='') {
    return this.httpClient.post(this._endpoint + 'order/artic-sheet/',{data: data});
   }

   findOrderIdFromProductName(data:string=''){
    return this.httpClient.post(this._endpoint + 'order/order-service-2/',{data: data})
   }

   SaveOrderProvision(data: any){
    return this.httpClient.post(this._endpoint + 'order/order-service-save/',{data: data})
   } 
}
