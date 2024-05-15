import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DriverHours } from '../models/driver-hours.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverHoursService {


  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }


  /**
   * Get a driver hours from the backend by id
   *
   * @param id number id of driver hours to get
   *
   * @returns Observable<DriverHour>
   */
  getDriverHoursById(id: number): Observable<DriverHours> {

    if (id <= 0 || id === null || id === undefined) {
      throw new Error('DriverHoursService: Id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'driver-hours/' + id).pipe(map((value: any) => {
      return <DriverHours>value;
    }));
  }


  /**
   * creates a driver hours in the backend based on driver hours object.
   * @param DriverHours driver hours object.
   *
   * @returns Observable<DriverHours>
   */
  createDriverHours(driverHours: DriverHours): Observable<DriverHours> {


    if (!driverHours) {
      throw new Error('driver hours service: you must supply a driver hours object for saving');
    }

    delete driverHours.createdAt;
    delete driverHours.updatedAt;

    if (driverHours.id > 0) {
      throw new Error('driver hours service: Cannot create a existing object');
    }

    delete driverHours.id;
    return this.httpClient.post(this._endpoint + 'driver-hours',
      JSON.stringify(driverHours),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <DriverHours>data;
      }));
  }


  /**
   * updates a driver hours in the backend based on driver hours object.
   * @param driverHours driver hours object.
   *
   * @returns Observable<DriverHours>
   */
  updateDriverHours(driverHours: DriverHours): Observable<DriverHours> {


    if (!driverHours) {
      throw new Error('driver hours service: you must supply a driver hours object for saving');
    }

    delete driverHours.createdAt;
    delete driverHours.updatedAt;

    if (!driverHours.id || driverHours.id === -1) {
      throw new Error('driver hours service: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'driver-hours/' + driverHours.id,
      JSON.stringify(driverHours),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <DriverHours>data;
      }));
  }

  getDriverHoursByDate(date: string): Observable<DriverHours[]> {

    if (!date) {
      throw new Error('Date must be provided in getDriverHoursByDate');
    }

    date = moment(date).format('YYYY-MM-DD');

    return this.httpClient.get(this._endpoint + 'driver-hours?filter=date||eq||"' + date + '"').pipe(map((value: any) => {
      return <DriverHours[]>value;
    }));

  }

  bulkCreateOrUpdateDriverHours(driverHours: DriverHours[]): Observable<DriverHours[]> {
    if (!driverHours) {
      throw new Error('driver hours service: you must supply a driver hours objects for creating/saving in bulk');
    }

    driverHours.forEach((hours) => {
      // If it's a create remove id
      if(hours.id === -1) {
        delete hours.id;
      }

      delete hours.createdAt;
      delete hours.updatedAt;
    });

    return this.httpClient.post(this._endpoint + 'driver-hours/bulk',
      JSON.stringify({ "bulk": driverHours }),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <DriverHours[]>data;
      }));
  }
}
