  import { Injectable } from '@angular/core';
  import { environment } from 'src/environments/environment';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Driver } from '../models/driver.model';
  import { DriverType } from '../models/driver-type.model';
  import { DriverBonusLevel } from '../models/driver-bonus-level.model';

  @Injectable({
    providedIn: 'root'
  })
  export class DriverBonusLevelService {


    /**
    * Endpoint for http calls
    */
   private _endpoint: string = environment.api.endpoint;


   constructor(private httpClient: HttpClient) { }


   /**
    * Get a driver bonus level from the backend by id
    *
    * @param id number id of driver bonus level to get
    *
    * @returns Observable<DriverBonusLevel>
    */
   getDriverBonusLevelById(id: number): Observable<DriverBonusLevel> {

     if(id <= 0 || id === null || id === undefined) {
       throw new Error('DriverBonusLevelService: Id must be a valid number');
     }

    return this.httpClient.get(this._endpoint + 'driver-bonus-level/' + id).pipe(map((value: any) => {
       return <DriverBonusLevel>value;
    }));
   }
x

   /**
    * creates a driver bonus level in the backend based on driver bonus level object.
    * @param DriverBonusLevel driver bonus level object.
    *
    * @returns Observable<DriverBonusLevel>
    */
   createDriverBonusLevel(driverBonusLevel: DriverBonusLevel): Observable<DriverBonusLevel> {


     if(!driverBonusLevel) {
       throw new Error('driver bonus service: you must supply a driver object for saving');
     }

     delete driverBonusLevel.createdAt;
     delete driverBonusLevel.updatedAt;

     if(driverBonusLevel.id > 0) {
       throw new Error('driver bonus service: Cannot create a existing object');
     }

     delete driverBonusLevel.id;
     return this.httpClient.post(this._endpoint + 'driver-bonus-level',
     JSON.stringify(driverBonusLevel),
     {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
       return <DriverBonusLevel>data;
     }));
   }


   /**
    * updates a driver bonus level in the backend based on driver bonus level object.
    * @param driverBonusLevel driver bonus level object.
    *
    * @returns Observable<DriverBonusLevel>
    */
   updateDriver(driverBonusLevel: DriverBonusLevel): Observable<DriverBonusLevel> {


     if(!driverBonusLevel) {
       throw new Error('driver bonus level ervice: you must supply a driver bonus level object for saving');
     }

     delete driverBonusLevel.createdAt;
     delete driverBonusLevel.updatedAt;

     if(!driverBonusLevel.id || driverBonusLevel.id === -1) {
       throw new Error('driver bonus level service: Cannot update an record without id');
     }

     return this.httpClient.put(this._endpoint + 'driver-bonus-level/' + driverBonusLevel.id,
     JSON.stringify(driverBonusLevel),
     {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
       return <DriverBonusLevel>data;
     }));
   }


   getAllDriverBonusLevels(): Observable<DriverBonusLevel[]> {
    return this.httpClient.get(this._endpoint + 'driver-bonus-level').pipe(map((data) => {
      return <DriverBonusLevel[]>data;
    }));
  }

}
