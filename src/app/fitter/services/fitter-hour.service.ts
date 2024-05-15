import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FitterHours } from '../models/fitter-hours.model';

@Injectable({
  providedIn: 'root'
})
export class FitterHourService {


    /**
    * Endpoint for http calls
    */
   private _endpoint: string = environment.api.endpoint;

   constructor(private httpClient: HttpClient) { }
 
 
   getAllFitterHours() {
     return this.httpClient.get(this._endpoint + 'fitter-hours').pipe(map((value: any) => {
       return <FitterHours>value;
    }));
   }
 
   getFitterHoursById(id: number): Observable<FitterHours> {
 
     if(id <= 0 || id === null || id === undefined) {
       throw new Error('FitterHourService: Id must be a valid number');
     }
 
    return this.httpClient.get(this._endpoint + 'fitter-hours/' + id).pipe(map((value: any) => {
       return <FitterHours>value;
    }));
   }
 
  createFitterHours(fitterHours: FitterHours): Observable<FitterHours> {
 
 
   if(!fitterHours) {
     throw new Error('fitter hours service: you must supply a fitter hours object for saving');
   }
 
   delete fitterHours.createdAt;
   delete fitterHours.updatedAt;
 
   if(fitterHours.id > 0) {
     throw new Error('fitter hours service: Cannot create a existing object');
   }
 
   delete fitterHours.id;
   return this.httpClient.post(this._endpoint + 'fitter-hours',
   JSON.stringify(fitterHours),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <FitterHours>data;
   }));
 }
 
 
 updateFitterHours(fitterHours: FitterHours): Observable<FitterHours> {
 
 
   if(!fitterHours) {
     throw new Error('fitter hour service: you must supply a fitter hour object for saving');
   }
 
   delete fitterHours.updatedAt;
 
   if(!fitterHours.id || fitterHours.id === -1) {
     throw new Error('fitter hours service: Cannot update an record without id');
   }
 
   return this.httpClient.put(this._endpoint + 'fitter-hours/' + fitterHours.id,
   JSON.stringify(fitterHours),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <FitterHours>data;
   }));
 }

 getFitterHoursByDate(date: string): Observable<FitterHours[]> {

  if (!date) {
    throw new Error('Date must be provided in getFitterHoursByDate');
  }

  date = moment(date).format('YYYY-MM-DD');

  return this.httpClient.get(this._endpoint + 'fitter-hours?filter=date||eq||"' + date + '"').pipe(map((value: any) => {
    return <FitterHours[]>value;
  }));

}

bulkCreateOrUpdateFitterHours(hours: FitterHours[]): Observable<FitterHours[]> {
  if (!hours) {
    throw new Error('fitter hours service: you must supply a fitter hours objects for creating/saving in bulk');
  }

  hours.forEach((hours) => {
    // If it's a create remove id
    if(hours.id === -1) {
      delete hours.id;
    }

    delete hours.createdAt;
    delete hours.updatedAt;
  });

  return this.httpClient.post(this._endpoint + 'fitter-hours/bulk',
    JSON.stringify({ "bulk": hours }),
    { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
      return <FitterHours[]>data;
    }));
}
}
