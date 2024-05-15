import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FuelPrice } from '../models/fuel-price.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FuelPriceService {

 /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a fuel price from the backend by id
  *
  * @param id number id of fuel price to get
  *
  * @returns Observable<FuelPrice>
  */
 getFuelPriceById(id: number): Observable<FuelPrice> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('FuelPriceService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'fuel-price/' + id).pipe(map((value: any) => {
     return <FuelPrice>value;
  }));
 }


 /**
  * creates a fuel price in the backend based on fuel price object.
  * @param FuelPrice fuel price object.
  *
  * @returns Observable<FuelPrice>
  */
 createFuelPrice(fuelPrice: FuelPrice): Observable<FuelPrice> {


   if(!fuelPrice) {
     throw new Error('fuel price service: you must supply a fuel price object for saving');
   }

   delete fuelPrice.createdAt;
   delete fuelPrice.updatedAt;

   if(fuelPrice.id > 0) {
     throw new Error('fuel price service: Cannot create a existing object');
   }

   delete fuelPrice.id;
   return this.httpClient.post(this._endpoint + 'fuel-price',
   JSON.stringify(fuelPrice),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <FuelPrice>data;
   }));
 }


 /**
  * updates a fuel price in the backend based on fuel price object.
  * @param fuelprice fuel price object.
  *
  * @returns Observable<FuelPrice>
  */
 updateFuelPrice(fuelPrice: FuelPrice): Observable<FuelPrice> {


   if(!fuelPrice) {
     throw new Error('fuel price service: you must supply a fuel price object for saving');
   }

   delete fuelPrice.createdAt;
   delete fuelPrice.updatedAt;

   if(!fuelPrice.id || fuelPrice.id === -1) {
     throw new Error('fuel price service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'fuel-price/' + fuelPrice.id,
   JSON.stringify(fuelPrice),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <FuelPrice>data;
   }));
 }
}
