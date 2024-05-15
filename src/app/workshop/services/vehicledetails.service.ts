import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { VehicleDetails } from '../models/vehicledetails.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleDetailService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

  getAllVehicles(): Observable<VehicleDetails[]> {
    return this.httpClient.get(this._endpoint + 'vehicledetails').pipe(map((data) => {
      return <VehicleDetails[]>data;
    }));
  }

  getAllVehiclesByType(id:number): Observable<VehicleDetails[]> {
    return this.httpClient.get(this._endpoint + 'vehicledetails?filter=vehicle.vehicleTypeId||eq||' + id).pipe(map((data) => {
      return <VehicleDetails[]>data;
    }));
  }

  getVehicleByDetailId(id:number): Observable<VehicleDetails[]> {
    return this.httpClient.get(this._endpoint + 'vehicledetails?filter=id||eq||' + id).pipe(map((data) => {
      return <VehicleDetails[]>data;
    }));
  }

  getVehicleByVehicleId(id:number): Observable<VehicleDetails[]> {
    return this.httpClient.get(this._endpoint + 'vehicledetails?filter=vehicleId||eq||' + id).pipe(map((data) => {
      return <VehicleDetails[]>data;
    }));
  }
  /**
   * updates a vehicle in the backend based on vehicle object.
   * @param vehicle vehicle object.
   *
   * @returns Observable<Vehicle>
   */
  saveVehicle(vehicleDetail: VehicleDetails): Observable<VehicleDetails> {
    // delete vehicleDetail.vehicle;

    if(!vehicleDetail) {
      throw new Error('vehicle service: you must supply a vehicle object for saving');
    }

    delete vehicleDetail.updatedAt;

    if(!vehicleDetail.id || vehicleDetail.id === -1) {
      throw new Error('vehicle service: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'vehicledetails/' + vehicleDetail.id,
    JSON.stringify(vehicleDetail),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleDetails>data;
    }));
  }

  /**
   * updates a vehicle in the backend based on vehicle object.
   * @param vehicle vehicle object.
   *
   * @returns Observable<Vehicle>
   */
  createVehicle(vehicleDetail: VehicleDetails): Observable<VehicleDetails> {
    // delete vehicleDetail.vehicle;
    delete vehicleDetail.id;

    if(!vehicleDetail) {
      throw new Error('vehicle service: you must supply a vehicle object for saving');
    }

    delete vehicleDetail.createdAt;
    delete vehicleDetail.updatedAt;

    return this.httpClient.post(this._endpoint + 'vehicledetails/',
    JSON.stringify(vehicleDetail),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleDetails>data;
    }));
  }

  checkForUnsetVehicles(): Observable<Vehicle[]>{
    return this.httpClient.get(this._endpoint + 'vehicle').pipe(map((data) => {
      return <Vehicle[]>data;
    }));
  }
}
