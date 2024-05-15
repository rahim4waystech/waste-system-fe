import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DriverAbsence } from '../models/driver-absence.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Driver } from '../models/driver.model';
import { DriverAbsenceType } from '../models/driver-absence-type.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DriverAbsenceService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a driver absence from the backend by id
  *
  * @param id number id of driver absence to get
  *
  * @returns Observable<DriverAbsence>
  */
 getDriverAbsenceById(id: number): Observable<DriverAbsence> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('DriverAbsenceService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'driver-absence/' + id).pipe(map((value: any) => {
     return <DriverAbsence>value;
  }));
 }


 /**
  * creates a driver absence in the backend based on driver absence object.
  * @param DriverAbsence driver absence object.
  *
  * @returns Observable<DriverAbsence>
  */
 createDriverAbsence(driverAbsence: DriverAbsence): Observable<DriverAbsence> {


   if(!driverAbsence) {
     throw new Error('driver absence service: you must supply a driver absence object for saving');
   }

   delete driverAbsence.createdAt;
   delete driverAbsence.updatedAt;

   if(driverAbsence.id > 0) {
     throw new Error('driver absence service: Cannot create a existing object');
   }

   delete driverAbsence.id;
   return this.httpClient.post(this._endpoint + 'driver-absence',
   JSON.stringify(driverAbsence),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <DriverAbsence>data;
   }));
 }


 /**
  * updates a driver absence in the backend based on driver absence object.
  * @param driverAbsence driver absence object.
  *
  * @returns Observable<DriverAbsence>
  */
 updateDriverAbsence(driverAbsence: DriverAbsence): Observable<DriverAbsence> {


   if(!driverAbsence) {
     throw new Error('driver absence service: you must supply a driver absence object for saving');
   }

   delete driverAbsence.createdAt;
   delete driverAbsence.updatedAt;

   if(!driverAbsence.id || driverAbsence.id === -1) {
     throw new Error('driver absence service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'driver-absence/' + driverAbsence.id,
   JSON.stringify(driverAbsence),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <DriverAbsence>data;
   }));
 }

 getAllDriverAbsenceTypes(): Observable<DriverAbsenceType[]> {
   return this.httpClient.get(this._endpoint + 'driver-absence-type').pipe(map((data) => {
     return <DriverAbsenceType[]>data;
   }));
 }


 deleteDriverAbsence(id: number): Observable<any> {

  if(id === -1) {
    throw new Error('driver absence service: Cannot delete a new object');
  }

  return this.httpClient.delete(this._endpoint + 'driver-absence/' + id);
}

getAbsenceByDate(date: string): Observable<DriverAbsence[]> {
  if(!date) {
    throw new Error('driver absence service: you must provide a date to get absence');
  }

  date = moment(date).format('YYYY-MM-DD');

  return this.httpClient.get(this._endpoint + 'driver-absence?filter[0]=startDate||$lte||' + date + '"&filter[1]=endDate||$gte||"' + date + '"').pipe(map(data => {
    return <DriverAbsence[]>data;
  }));
}
}
