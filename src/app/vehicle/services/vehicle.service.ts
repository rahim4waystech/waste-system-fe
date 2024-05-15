import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VehicleType } from '../models/vehicle-type.model';
import { FuelType } from '../models/fuel-type.model';
import { Account } from 'src/app/order/models/account.model';
import { SecondaryVehicleType } from '../models/secondary-vehicle-type.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a vehicle from the backend by id
  *
  * @param id number id of vehicle to get
  *
  * @returns Observable<Vehicle>
  */
 getVehicleById(id: number): Observable<Vehicle> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('VehicleService: Id must be a valid number');
   } else {
     return this.httpClient.get(this._endpoint + 'vehicle/' + id).pipe(map((value: any) => {
        return <Vehicle>value;
     }));
   }


 }

 /**
  * Get a vehicle from the backend by id
  *
  * @param vehicleTypeId number id of vehicle type to get
  *
  * @returns Observable<Vehicle>
  */
 getVehicleByType(id: number): Observable<Vehicle> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('VehicleService: TypeId must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'vehicle?filter=vehicleTypeId||eq||' + id).pipe(map((value: any) => {
     return <Vehicle>value;
  }));
 }


 getVehiclesByVehicleTypeByName(name: string): Observable<Vehicle> {

  // if(id <= 0 || id === null || id === undefined) {
  //   throw new Error('VehicleService: TypeId must be a valid number');
  // }

 return this.httpClient.get(this._endpoint + 'vehicle?vehicleTypeName=' + name).pipe(map((value: any) => {
    return <Vehicle>value;
 }));
}



 /**
  * Get a vehicle from the backend by id
  *
  * @param registration registration of vehicle to check
  *
  * @returns Observable<Vehicle>
  */
 vehicleExists(registration: string): Observable<Vehicle> {
   if(registration !== undefined && registration !== '' && registration !== null){
     return this.httpClient.get(this._endpoint + 'vehicle?filter=registration||eq||' + JSON.stringify(registration)).pipe(map((value: any) => {
       return <Vehicle>value;
     }));
   }
 }

 /**
  * creates a vehicle in the backend based on vehicle object.
  * @param Vehicle vehicle object.
  *
  * @returns Observable<Vehicle>
  */
 createVehicle(vehicle: Vehicle): Observable<Vehicle> {


   if(!vehicle) {
     throw new Error('vehicle service: you must supply a vehicle object for saving');
   }

   delete vehicle.createdAt;
   delete vehicle.updatedAt;

   if(vehicle.id > 0) {
     throw new Error('vehicle service: Cannot create a existing object');
   }

   delete vehicle.id;
   return this.httpClient.post(this._endpoint + 'vehicle',
   JSON.stringify(vehicle),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Vehicle>data;
   }));
 }


 /**
  * updates a vehicle in the backend based on vehicle object.
  * @param vehicle vehicle object.
  *
  * @returns Observable<Vehicle>
  */
 updateVehicle(vehicle: Vehicle): Observable<Vehicle> {


   if(!vehicle) {
     throw new Error('vehicle service: you must supply a vehicle object for saving');
   }

   delete vehicle.createdAt;

   // fix to ensure default for depot
   if(vehicle.depot === null) {
     vehicle.depot = new Account();
   }

   if(!vehicle.id || vehicle.id === -1) {
     throw new Error('vehicle service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'vehicle/' + vehicle.id,
   JSON.stringify(vehicle),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Vehicle>data;
   }));
 }

 getAllVehicleTypes(): Observable<VehicleType[]> {
   return this.httpClient.get(this._endpoint + 'vehicle-type?sort=name,ASC').pipe(map((data) => {
     return <VehicleType[]>data;
   }));
 }

 getAllVehicles(): Observable<Vehicle[]> {
  return this.httpClient.get(this._endpoint + 'vehicle?sort=registration,ASC').pipe(map((data) => {
    return <Vehicle[]>data;
  }));
 }

 getAllVehiclesByType(id: number): Observable<Vehicle[]> {
  return this.httpClient.get(this._endpoint + 'vehicle?filter=vehicleTypeId||eq||' +id).pipe(map((data) => {
    return <Vehicle[]>data;
  }));
 }

 getAllPaginatedVehicles(limit:number,page:number,vehicleType:number){
  return this.httpClient.get(this._endpoint + 'vehicle?filter=vehicleTypeId||eq||'+vehicleType+'&page='+page+'&limit='+limit+'&sort=purchaseDate,DESC&sort=createdAt,DESC').pipe(map((data) => {
    return data;
  }));
 }

 getAllPaginatedTrailers(limit:number,page:number,vehicleType:number){
  return this.httpClient.get(this._endpoint + 'vehicle?filter=vehicleTypeId||eq||'+vehicleType+'&page='+page+'&limit='+limit).pipe(map((data) => {
    return data;
  }));
 }

 getAllFuelTypes(): Observable<FuelType[]> {
  return this.httpClient.get(this._endpoint + 'fuel-type').pipe(map((data) => {
    return <FuelType[]>data;
  }));
 }

 getAllVehiclesByDepot(depotId: number): Observable<Vehicle[]> {
   if(!depotId || depotId === -1) {
     throw new Error('Please provide a valid depotId for getAllVehiclesByDepot');
   }
   return this.httpClient.get(this._endpoint + 'vehicle?sort=registration,ASC&filter=depotId||eq||' + depotId + '&filter=active||eq||1').pipe(map((data) => {
     return <Vehicle[]>data;
   }))
 }

 getAllTipperVehiclesByDepot(depotId: number): Observable<Vehicle[]> {
  if(!depotId || depotId === -1) {
    throw new Error('Please provide a valid depotId for getAllVehiclesByDepot');
  }
  return this.httpClient.get(this._endpoint + 'vehicle?sort=registration,ASC&filter=depotId||eq||' + depotId + '&filter=active||eq||1&filter=vehicleTypeId||in||1,2').pipe(map((data) => {
    return <Vehicle[]>data;
  }))
}

 getAllVehiclesByDepotAndVehicleTypeId(depotId: number, vehicleTypeMatch:string): Observable<Vehicle[]> {
  if(!vehicleTypeMatch || vehicleTypeMatch === '') {
    throw new Error('Please provide a valid VehicleType for getAllVehiclesByDepotAndVehicleTypeId');
  }
  if(!depotId || depotId === -1) {
    throw new Error('Please provide a valid depotId for getAllVehiclesByDepotAndVehicleTypeId');
  }
  return this.httpClient.get(
    this._endpoint + 'vehicle?sort=registration,ASC&filter=depotId||eq||' +
    depotId +
    '&filter=vehicleTypeId||in||' +
    vehicleTypeMatch +
    '&filter=active||eq||1').pipe(map((data) => {
    return <Vehicle[]>data;
  }))
}

  getAllSkipVehiclesByDepot(depotId: number): Observable<Vehicle[]> {
    if(!depotId || depotId === -1) {
      throw new Error('Please provide a valid depotId for getAllVehiclesByDepot');
    }
    return this.httpClient.get(this._endpoint + 'vehicle?sort=registration,ASC&filter=depotId||eq||' + depotId + '&filter=active||eq||1&filter=vehicleTypeId||in||1,2').pipe(map((data) => {
      return <Vehicle[]>data;
    }))
  }

  /**
   * Get a vehicle from the backend by id
   *
   * @param id number id of vehicle to get
   *
   * @returns Observable<Vehicle>
   */
  getSecondaryVehicleTypesByTypeId(id: number): Observable<SecondaryVehicleType> {
    if(id <= 0 || id === null || id === undefined) {
      throw new Error('VehicleTypeService: Id must be a valid number');
    } else {
      return this.httpClient.get(this._endpoint + 'secondary-vehicletype?filter=vehicleTypeId||eq||' + id).pipe(map((value: any) => {
         return <SecondaryVehicleType>value;
      }));
    }


  }

}
