import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VehicleInspectionIntervals } from '../models/vehicleinspectionintervals.model';
import { VehicleInspectionAssignments } from '../models/vehicleinspectionassignment.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleInspectionIntervalService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

  getAllInspectionIntervals(): Observable<VehicleInspectionIntervals[]> {
    return this.httpClient.get(this._endpoint + 'vehicleinspectionintervals').pipe(map((data) => {
      return <VehicleInspectionIntervals[]>data;
    }));
  }

  addInspectionInterval(interval):Observable<VehicleInspectionIntervals>{
    delete interval.id;
    delete interval.createdAt;
    delete interval.updatedAt;
    
    return this.httpClient.post(this._endpoint + 'vehicleinspectionintervals',
    JSON.stringify(interval),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleInspectionIntervals>data;
    }));
  }

  getInspectionIntervalById(id:number): Observable<VehicleInspectionIntervals[]> {
    return this.httpClient.get(this._endpoint + 'vehicleinspectionintervals?filter=id||eq||' +id).pipe(map((data) => {
      return <VehicleInspectionIntervals[]>data;
    }));
  }

  getAllInspectionIntervalsByEntity(entity:string): Observable<VehicleInspectionIntervals[]> {
    return this.httpClient.get(this._endpoint + 'vehicleinspectionintervals?filter=entity||eq||' + entity).pipe(map((data) => {
      return <VehicleInspectionIntervals[]>data;
    }));
  }

  getAllInspectionAssignmentsByVehicle(id:number): Observable<VehicleInspectionAssignments[]>{
    return this.httpClient.get(this._endpoint + 'vehicleinspectionassignments?filter=vehicleDetailId||eq||' +id).pipe(map((data) => {
      return <VehicleInspectionAssignments[]>data;
    }));
  }

  deleteInspectionAssignment(id){
    return this.httpClient.delete(this._endpoint + 'vehicleinspectionassignments/' + id);
  }

  addInspectionAssignment(assignment):Observable<VehicleInspectionAssignments>{
    return this.httpClient.post(this._endpoint + 'vehicleinspectionassignments',
    JSON.stringify(assignment),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleInspectionAssignments>data;
    }));
  }

  addBulkInspectionAssignment(assignments:VehicleInspectionAssignments[]){
    if(!assignments) {
      throw new Error('You must provide a valid permission object in bulkAssetUpdate');
    }
      assignments.forEach((assignments: VehicleInspectionAssignments) => {

      delete assignments.updatedAt;
    })
      return this.httpClient.post(this._endpoint + 'vehicleinspectionassignments/bulk',
    JSON.stringify({bulk: assignments}),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <VehicleInspectionAssignments[]>data;
    }));
  }

  deleteAllAssignmentsForParentId(parentId: number) {
    if(!parentId || parentId === -1) {
      throw new Error('You must supply a valid id in deleteAllForParentId');
    }

    return this.httpClient.delete(this._endpoint + 'vehicleinspectionassignments/deleteByParentId/' + parentId);
  }

  getLastInspectionByVehicleIdAndIntervalId(vehicleId:number,inspectionId:number){
    return this.httpClient.get(this._endpoint + 'inspection-dates?filter=vehicleId||eq||' + vehicleId + '&filter=inspectionIntervalId||eq||'+inspectionId+'&sort=date,DESC&limit=1')
  }
}
