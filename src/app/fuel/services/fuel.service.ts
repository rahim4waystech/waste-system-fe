import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fuel } from '../models/fuel.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FuelService {


 /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a fuel from the backend by id
  *
  * @param id number id of fuel to get
  *
  * @returns Observable<Fuel>
  */
 getFuelById(id: number): Observable<Fuel> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('FuelService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'fuel/' + id).pipe(map((value: any) => {
     return <Fuel>value;
  }));
 }


 /**
  * creates a fuel in the backend based on fuel object.
  * @param Fuel fuel object.
  *
  * @returns Observable<Fuel>
  */
 createFuel(fuel: Fuel): Observable<Fuel> {


   if(!fuel) {
     throw new Error('fuel service: you must supply a fuel object for saving');
   }

   delete fuel.createdAt;
   delete fuel.updatedAt;

   if(fuel.id > 0) {
     throw new Error('fuel service: Cannot create a existing object');
   }

   delete fuel.id;
   return this.httpClient.post(this._endpoint + 'fuel',
   JSON.stringify(fuel),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Fuel>data;
   }));
 }


 /**
  * updates a fuel in the backend based on fuel object.
  * @param fuel fuel object.
  *
  * @returns Observable<Fuel>
  */
 updateFuel(fuel: Fuel): Observable<Fuel> {


   if(!fuel) {
     throw new Error('fuel service: you must supply a fuel object for saving');
   }

   delete fuel.createdAt;
   delete fuel.updatedAt;

   if(!fuel.id || fuel.id === -1) {
     throw new Error('fuel service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'fuel/' + fuel.id,
   JSON.stringify(fuel),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Fuel>data;
   }));
 }
}
