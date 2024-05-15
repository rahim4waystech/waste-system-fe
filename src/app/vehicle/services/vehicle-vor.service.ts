import { Injectable } from '@angular/core';
import { VehicleVOR } from '../models/vehicle-vor.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class VehicleVorService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a vehicle vor from the backend by id
  *
  * @param id number id of vehicle vor to get
  *
  * @returns Observable<VehicleVOR>
  */
 getVehicleVORById(id: number): Observable<VehicleVOR> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('VehicleVORService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'vehicle-vor/' + id).pipe(map((value: any) => {
     return <VehicleVOR>value;
  }));
 }


 /**
  * creates a vehicle vor in the backend based on vehicle vor object.
  * @param VehicleVOR vehicle vor object.
  *
  * @returns Observable<VehicleVOR>
  */
 createVehicleVOR(vehicleVOR: VehicleVOR): Observable<VehicleVOR> {


   if(!vehicleVOR) {
     throw new Error('vehicle vor service: you must supply a vehicle vor object for saving');
   }

   delete vehicleVOR.createdAt;
   delete vehicleVOR.updatedAt;

   if(vehicleVOR.id > 0) {
     throw new Error('vehicle vor service: Cannot create a existing object');
   }

   delete vehicleVOR.id;
   return this.httpClient.post(this._endpoint + 'vehicle-vor',
   JSON.stringify(vehicleVOR),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <VehicleVOR>data;
   }));
 }


 /**
  * updates a vehicle vor in the backend based on vehicle vor object.
  * @param vehicleVOR vehicle vor object.
  *
  * @returns Observable<VehicleVOR>
  */
 updateVehicleVOR(vehicleVOR: VehicleVOR): Observable<VehicleVOR> {


   if(!vehicleVOR) {
     throw new Error('vehicle vor service: you must supply a vehicle vor object for saving');
   }

   delete vehicleVOR.createdAt;
   delete vehicleVOR.updatedAt;

   if(!vehicleVOR.id || vehicleVOR.id === -1) {
     throw new Error('vehicle vor service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'vehicle-vor/' + vehicleVOR.id,
   JSON.stringify(vehicleVOR),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <VehicleVOR>data;
   }));
 }

 getVehicleVORsByDate(date: string=''): Observable<VehicleVOR[]> {
  if(!date || date === '') {
    throw new Error('You must provide a date getVehicleVORsByDate');
  }

  date = moment(date).format("YYYY-MM-DD");

  return this.httpClient.get(this._endpoint + 'vehicle-vor?filter=startDate||lte||"' + date + '"' + '&filter=endDate||gte||"' + date + '"&filter=deleted||ne||1')
  .pipe(map((data) => {
    return <VehicleVOR[]>data;
  }))
 }

 getVORByDateAndVehicleId(date: string='',vehicleId:number): Observable<VehicleVOR[]> {
  if(!date || date === '') {
    throw new Error('You must provide a date removeVehicleVORsByDateAndVehicleId');
  }
  if(!date || date === '') {
    throw new Error('You must provide a vehicleId removeVehicleVORsByDateAndVehicleId');
  }

  date = moment(date).format("YYYY-MM-DD");

  return this.httpClient.get(this._endpoint + 'vehicle-vor?filter=startDate||eq||' + date + '&filter=deleted||ne||1')
  .pipe(map((data) => {
    return<VehicleVOR[]>data;
  }))
 }

 getVehicleVORsByDateAndVehicleTypeId(date: string='',vehicleTypeId:number): Observable<VehicleVOR[]> {
  if(!date || date === '') {
    throw new Error('You must provide a date getVehicleVORsByDate');
  }
  if(vehicleTypeId === -1) {
    throw new Error('You must provide a vehicleTypeId getVehicleVORsByDate');
  }

  date = moment(date).format("YYYY-MM-DD");

  return this.httpClient.get(this._endpoint + 'vehicle-vor?filter=startDate||lte||"' + date + '"' + '&filter=endDate||gte||"' + date + '"&filter=vehicle.vehicleTypeId||eq||'+vehicleTypeId + "&filter=deleted||ne||1")
  .pipe(map((data) => {
    return <VehicleVOR[]>data;
  }))
 }
}
