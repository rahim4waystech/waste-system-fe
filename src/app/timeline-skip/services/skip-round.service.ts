import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkipRound } from '../models/skip-round.model';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SkipRoundService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

 getAllSkipRoundsByDateAndVehicleType(date: string, vehicleTypeId: number=-1): Observable<SkipRound[]> {

  if(!date || date === '') {
    throw new Error('Date must be provided on getAllSkipRoundsByDate');
  }

  date = moment(date).format('YYYY-MM-DD');

  let vehicleTypeString = '';

  if(vehicleTypeId !== -1) {
    vehicleTypeString += '&filter=vehicle.vehicleTypeId||eq||' + vehicleTypeId;
  }

  return this.httpClient.get(this._endpoint + 'skip-round?filter=date||eq||"' + date + '"' + vehicleTypeString + '&or=carryOver||eq||true').pipe(map((data) => {
    return <SkipRound[]>data;
  }));
 }


 /**
  * Get a skip round from the backend by id
  *
  * @param id number id of skip round to get
  *
  * @returns Observable<SkipRound>
  */
 getSkipRoundById(id: number): Observable<SkipRound> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('SkipRoundService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'skip-round/' + id).pipe(map((value: any) => {
     return <SkipRound>value;
  }));
 }


 /**
  * creates a skip round in the backend based on skip round object.
  * @param SkipRound skip round object.
  *
  * @returns Observable<SkipRound>
  */
 createSkipRound(skipRound: SkipRound): Observable<SkipRound> {


   if(!skipRound) {
     throw new Error('skip round service: you must supply a skip round object for saving');
   }

   delete skipRound.createdAt;
   delete skipRound.updatedAt;

   if(skipRound.id > 0) {
     throw new Error('skip round service: Cannot create a existing object');
   }

   delete skipRound.id;
   return this.httpClient.post(this._endpoint + 'skip-round',
   JSON.stringify(skipRound),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <SkipRound>data;
   }));
 }


 /**
  * updates a skip round in the backend based on skip round object.
  * @param skipRound Skip round object.
  *
  * @returns Observable<SkipRound>
  */
 updateSkipRound(skipRound: SkipRound): Observable<SkipRound> {


   if(!skipRound) {
     throw new Error('skip round service: you must supply a skip round object for saving');
   }

   delete skipRound.createdAt;
   delete skipRound.updatedAt;

   if(!skipRound.id || skipRound.id === -1) {
     throw new Error('skip round service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'skip-round/' + skipRound.id,
   JSON.stringify(skipRound),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <SkipRound>data;
   }));
 }
}
