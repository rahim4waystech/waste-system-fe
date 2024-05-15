import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DriverAbsenceType } from 'src/app/driver/models/driver-absence-type.model';
import { DriverAbsence } from 'src/app/driver/models/driver-absence.model';
import { environment } from 'src/environments/environment';
import { FitterAbsenceType } from '../models/fitter-absence-type.model';
import { FitterAbsence } from '../models/fitter-absence.model';

@Injectable({
  providedIn: 'root'
})
export class FitterAbsenceService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }



 getFitterAbsenceById(id: number): Observable<FitterAbsence> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('getFitterAbsenceById: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'fitter-absence/' + id).pipe(map((value: any) => {
     return <FitterAbsence>value;
  }));
 }



 createFitterAbsence(fitterAbsence: FitterAbsence): Observable<FitterAbsence> {


   if(!fitterAbsence) {
     throw new Error('fitter absence service: you must supply a fitter absence object for saving');
   }

   delete fitterAbsence.createdAt;
   delete fitterAbsence.updatedAt;

   if(fitterAbsence.id > 0) {
     throw new Error('fitter absence service: Cannot create a existing object');
   }

   delete fitterAbsence.id;
   return this.httpClient.post(this._endpoint + 'fitter-absence',
   JSON.stringify(fitterAbsence),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <FitterAbsence>data;
   }));
 }


 updateFitterAbsence(fitterAbsence: FitterAbsence): Observable<FitterAbsence> {


   if(!fitterAbsence) {
     throw new Error('fitter absence service: you must supply a fitter absence object for saving');
   }

   delete fitterAbsence.createdAt;
   delete fitterAbsence.updatedAt;

   if(!fitterAbsence.id || fitterAbsence.id === -1) {
     throw new Error('fitter absence service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'fitter-absence/' + fitterAbsence.id,
   JSON.stringify(fitterAbsence),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <FitterAbsence>data;
   }));
 }

 getAllFitterAbsenceTypes(): Observable<FitterAbsenceType[]> {
   return this.httpClient.get(this._endpoint + 'fitter-absence-type').pipe(map((data) => {
     return <FitterAbsenceType[]>data;
   }));
 }


 deleteFitterAbsence(id: number): Observable<any> {

  if(id === -1) {
    throw new Error('fitter absence service: Cannot delete a new object');
  }

  return this.httpClient.delete(this._endpoint + 'fitter-absence/' + id);
}

getAbsenceByDate(date: string): Observable<FitterAbsence[]> {
  if(!date) {
    throw new Error('fitter absence service: you must provide a date to get absence');
  }

  date = moment(date).format('YYYY-MM-DD');

  return this.httpClient.get(this._endpoint + 'fitter-absence?filter[0]=startDate||$lte||' + date + '"&filter[1]=endDate||$gte||"' + date + '"').pipe(map(data => {
    return <FitterAbsence[]>data;
  }));
}
}
