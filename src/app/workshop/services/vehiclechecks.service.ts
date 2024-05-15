import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VehicleChecks } from '../models/vehiclechecks.model';
import { VehicleSeverity } from '../models/vehicleseverity.model';
import { VehicleChecksAreas } from '../models/vehiclecheckarea.model';
import { VehicleCheckGroup } from '../models/vehiclecheckgroup.model';
import { VehicleCheckReport } from '../models/vehiclecheckreport.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class VehicleCheckService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

  getAllDriverChecks(): Observable<VehicleChecks[]> {
    return this.httpClient.get(this._endpoint + 'driver-checks').pipe(map((data) => {
      return <VehicleChecks[]>data;
    }));
  }

  getDriverChecks(vehicleId:number,driverId:number,date:string): Observable<VehicleChecks[]> {
    return this.httpClient.get(this._endpoint + 'driver-check-reports?filter=vehicleId||eq||'+ vehicleId +'&filter=driverId||eq||'+ driverId +'&filter=createdAt||cont||"' + date + '"').pipe(map((data) => {
      return <VehicleChecks[]>data;
    }));
  }

  getDriverChecksByVehicleType(vehicleTypeId:number): Observable<VehicleChecks[]> {
    return this.httpClient.get(this._endpoint + 'driver-checks?filter=vehicleTypeId||eq||0&or=vehicleTypeId||eq||'+ vehicleTypeId +'&filter=active||eq||1').pipe(map((data) => {
      return <VehicleChecks[]>data;
    }));
  }

  getDriverChecksByVehicleId(vehicleTypeId:number): Observable<VehicleCheckGroup[]> {
    return this.httpClient.get(this._endpoint + 'driver-check-group?filter=vehicleId||eq||' + vehicleTypeId + '&limit=5&sort=date,DESC').pipe(map((data) => {
      return <VehicleCheckGroup[]>data;
    }));
  }

  getDriverChecksGroupById(id:number): Observable<VehicleCheckGroup[]> {
    return this.httpClient.get(this._endpoint + 'driver-check-group?filter=id||eq||' + id).pipe(map((data) => {
      return <VehicleCheckGroup[]>data;
    }));
  }

  getDriverChecksByGroupId(groupId:number): Observable<VehicleCheckReport[]> {
    return this.httpClient.get(this._endpoint + 'driver-check-reports?filter=driverCheckGroupId||eq||' + groupId).pipe(map((data) => {
      return <VehicleCheckReport[]>data;
    }));
  }

  getDriverChecksGroupByDate(date:string): Observable<VehicleCheckGroup[]> {
    let formattedDate = moment(date).format('YYYY-MM-DD');
    return this.httpClient.get(this._endpoint + 'driver-check-group?filter=date||eq||"' + formattedDate + '"').pipe(map((data) => {
      return <VehicleCheckGroup[]>data;
    }));
  }

  getDriverChecksByStatus(id:number): Observable<VehicleCheckReport[]> {
    return this.httpClient.get(this._endpoint + 'driver-check-reports?filter=checkStatusId||eq||'+id+'&filter=result||eq||0').pipe(map((data) => {
      return <VehicleCheckReport[]>data;
    }));
  }

  /**
   * updates a vehicle in the backend based on vehicle object.
   * @param vehicle vehicle object.
   *
   * @returns Observable<Vehicle>
   */
  updateDriverCheckReport(vehicleChecks: VehicleChecks): Observable<VehicleChecks> {

    if(!vehicleChecks) {
      throw new Error('vehicle service: you must supply a vehicle object for saving');
    }

    delete vehicleChecks.updatedAt;

    if(!vehicleChecks.id || vehicleChecks.id === -1) {
      throw new Error('vehicle check service: Cannot update a record without id');
    }

    return this.httpClient.put(this._endpoint + 'driver-checks/' + vehicleChecks.id,
    JSON.stringify(vehicleChecks),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleChecks>data;
    }));
  }

  /**
   * updates a vehicle in the backend based on vehicle object.
   * @param report vehicreportle object.
   *
   * @returns Observable<VehicleCheckReport>
   */
  updateReport(report: VehicleCheckReport): Observable<VehicleCheckReport> {

    if(!report) {
      throw new Error('report service: you must supply a report object for saving');
    }

    delete report.updatedAt;

    if(!report.id || report.id === -1) {
      throw new Error('report check service: Cannot update a record without id');
    }

    return this.httpClient.put(this._endpoint + 'driver-check-reports/' + report.id,
    JSON.stringify(report),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleCheckReport>data;
    }));
  }

  /**
   * creates a vehicle check in the backend based on vehiclechecks object.
   * @param vehicle vehicle object.
   *
   * @returns Observable<Vehicle>
   */
  createVehicle(vehicleCheck: VehicleChecks): Observable<VehicleChecks> {
    if(!vehicleCheck) {
      throw new Error('vehicle service: you must supply a vehiclecheck object for saving');
    }

    vehicleCheck.severityDetail = {id:vehicleCheck.severity} as any
    vehicleCheck.vehicleCheckArea = {id:vehicleCheck.vehicleCheckAreaId} as any

    delete vehicleCheck.updatedAt;

    return this.httpClient.post(this._endpoint + 'driver-checks/',
    JSON.stringify(vehicleCheck),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleChecks>data;
    }));
  }


    /**
     * updates a vehicle in the backend based on vehicle object.
     * @param vehicle vehicle object.
     *
     * @returns Observable<Vehicle>
     */
    saveCheck(vehicleChecks: VehicleChecks): Observable<VehicleChecks> {

      if(!vehicleChecks) {
        throw new Error('vehicle service: you must supply a vehicle object for saving');
      }

      vehicleChecks.severityDetail = {id:vehicleChecks.severity} as any
      vehicleChecks.vehicleCheckArea = {id:vehicleChecks.vehicleCheckAreaId} as any

      delete vehicleChecks.updatedAt;

      if(!vehicleChecks.id || vehicleChecks.id === -1) {
        throw new Error('vehicle check service: Cannot update a record without id');
      }

      return this.httpClient.put(this._endpoint + 'driver-checks/' + vehicleChecks.id,
      JSON.stringify(vehicleChecks),
      {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
        return <VehicleChecks>data;
      }));
    }

  getAllVehicleSeverities(): Observable<VehicleSeverity[]> {
    return this.httpClient.get(this._endpoint + 'vehicle-severity?sort=severity,ASC').pipe(map((data) => {
      return <VehicleSeverity[]>data;
    }));
  }

  addSeverity(severity:VehicleSeverity){
    if(!severity) {
      throw new Error('severity service: you must supply a severity object for saving');
    }

    delete severity.updatedAt;
    delete severity.createdAt;
    delete severity.id;

    return this.httpClient.post(this._endpoint + 'vehicle-severity/',
    JSON.stringify(severity),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleSeverity>data;
    }));
  }

  updateSeverity(severity:VehicleSeverity){
    if(!severity) {
      throw new Error('severity service: you must supply a severity object for saving');
    }

    delete severity.updatedAt;

    if(!severity.id || severity.id === -1) {
      throw new Error('severity check service: Cannot update a record without id');
    }

    return this.httpClient.put(this._endpoint + 'vehicle-severity/' + severity.id,
    JSON.stringify(severity),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleSeverity>data;
    }));
  }

  getAllVehicleCheckAreas(): Observable<VehicleChecksAreas[]> {
    return this.httpClient.get(this._endpoint + 'vehicle-check-area').pipe(map((data) => {
      return <VehicleChecksAreas[]>data;
    }));
  }

  createVehicleCheckArea(checkArea:VehicleChecksAreas){
    if(!checkArea) {
      throw new Error('checkArea service: you must supply a checkArea object for saving');
    }

    delete checkArea.updatedAt;
    delete checkArea.createdAt;
    delete checkArea.id;

    return this.httpClient.post(this._endpoint + 'vehicle-check-area/',
    JSON.stringify(checkArea),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleChecksAreas>data;
    }));
  }

  updateVehicleCheckArea(checkArea:VehicleChecksAreas){
    if(!checkArea) {
      throw new Error('checkArea service: you must supply a checkArea object for saving');
    }

    delete checkArea.updatedAt;

    if(!checkArea.id || checkArea.id === -1) {
      throw new Error('checkArea check service: Cannot update a record without id');
    }

    return this.httpClient.put(this._endpoint + 'vehicle-check-area' + checkArea.id,
    JSON.stringify(checkArea),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleChecksAreas>data;
    }));
  }
}
