import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Driver } from '../models/driver.model';
import { DriverType } from '../models/driver-type.model';
import { Account } from 'src/app/order/models/account.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a driver from the backend by id
  *
  * @param id number id of driver to get
  *
  * @returns Observable<Driver>
  */
 getDriverById(id: number): Observable<Driver> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('DriverService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'driver/' + id).pipe(map((value: any) => {
     return <Driver>value;
  }));
 }

 /**
  * Get a driver from the backend by name
  *
  * @param firstName name of driver to get
  * @param lastName name of driver to get
  *
  * @returns Observable<Driver>
  */
 driverExists(firstName: string, lastName: string): Observable<Driver> {
  return this.httpClient.get(this._endpoint + 'driver?filter=firstName||eq||' + firstName + '&filter=lastName||eq||' + lastName).pipe(map((value: any) => {
     return <Driver>value;
  }));
 }

 /**
  * Get a driver from the backend by name
  *
  * @param firstName name of driver to get
  * @param lastName name of driver to get
  *
  * @returns Observable<Driver>
  */
 employeeNumberExists(employeeNo: string): Observable<Driver> {
  return this.httpClient.get(this._endpoint + 'driver?filter=employeeNumber||eq||' + employeeNo).pipe(map((value: any) => {
     return <Driver>value;
  }));
 }

 countDrivers(){
   return this.httpClient.get(this._endpoint + 'driver?fields=id');
 }




 /**
  * creates a driver in the backend based on driver object.
  * @param Driver driver object.
  *
  * @returns Observable<Driver>
  */
 createDriver(driver: Driver): Observable<Driver> {


   if(!driver) {
     throw new Error('driver service: you must supply a driver object for saving');
   }

   delete driver.createdAt;
   delete driver.updatedAt;

   if(driver.id > 0) {
     throw new Error('driver service: Cannot create a existing object');
   }

   delete driver.id;
   return this.httpClient.post(this._endpoint + 'driver',
   JSON.stringify(driver),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Driver>data;
   }));
 }


 /**
  * updates a driver in the backend based on driver object.
  * @param driver driver object.
  *
  * @returns Observable<Driver>
  */
 updateDriver(driver: Driver): Observable<Driver> {


   if(!driver) {
     throw new Error('driver service: you must supply a driver object for saving');
   }

   if(driver.depot === null) {
     driver.depot = new Account();
   }

   if(driver.trailer === null) {
     driver.trailer = new Vehicle();
   }

   if(driver.vehicle === null) {
     driver.vehicle = new Vehicle();
   }

   
   delete driver.updatedAt;

   if(!driver.id || driver.id === -1) {
     throw new Error('driver service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'driver/' + driver.id,
   JSON.stringify(driver),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Driver>data;
   }));
 }

 getAllDriverTypes(): Observable<DriverType[]> {
   return this.httpClient.get(this._endpoint + 'driver-type').pipe(map((data) => {
     return <DriverType[]>data;
   }));
 }

 getAllDrivers(): Observable<Driver[]> {
  return this.httpClient.get(this._endpoint + 'driver?sort=firstName,ASC').pipe(map((data) => {
    return <Driver[]>data;
  }));
}

 getLinkedDrivers(): Observable<Driver[]> {
  return this.httpClient.get(this._endpoint + 'driver?filter=vehicleId||ne||-1').pipe(map((data) => {
    return <Driver[]>data;
  }));
}

 getPaginatedDrivers(limit:number,page:number){
  return this.httpClient.get(this._endpoint + 'driver?page='+page+'&limit='+limit+'&sort=lastName,ASC').pipe(map((data) => {
    return data;
  }));
}

getAllDriversByDepot(depotId: number): Observable<Driver[]> {
  if(!depotId || depotId === -1) {
    throw new Error('Please provide a valid depotId for getAllDriversByDepot');
  }
  return this.httpClient.get(this._endpoint + 'driver?sort=firstName,ASC&?filter=depotId||eq||' + depotId + '&filter=active||eq||1').pipe(map((data) => {
    return <Driver[]>data;
  }))
}
}
