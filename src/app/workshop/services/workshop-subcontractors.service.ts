import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkshopSubcontractors } from '../models/workshop-subcontractors.model';

@Injectable({
  providedIn: 'root'
})
export class WorkshopSubcontractorsService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

  getAllSubcontractors(): Observable<WorkshopSubcontractors[]> {
    return this.httpClient.get(this._endpoint + 'workshop-subcontractors?filter=parentId||eq||-1').pipe(map((data) => {
      return <WorkshopSubcontractors[]>data;
    }));
  }

  getSubcontractorById(id:number): Observable<WorkshopSubcontractors[]> {
    return this.httpClient.get(this._endpoint + 'workshop-subcontractors?filter=id||eq||' + id).pipe(map((data) => {
      return <WorkshopSubcontractors[]>data;
    }));
  }

  getSubcontractorDepots(id:number): Observable<WorkshopSubcontractors[]> {
    return this.httpClient.get(this._endpoint + 'workshop-subcontractors?filter=parentId||eq||'+id).pipe(map((data) => {
      return <WorkshopSubcontractors[]>data;
    }));
  }

  getOwnDepots(): Observable<WorkshopSubcontractors[]> {
    return this.httpClient.get(this._endpoint + 'workshop-subcontractors?filter=ownDepot||eq||1').pipe(map((data) => {
      return <WorkshopSubcontractors[]>data;
    }));
  }

  /**
   * creates a subcontractor or depot for Workshops in the backend
   * @param workshopSubcontractors workshop subbie object.
   *
   * @returns Observable<WorkshopSubcontractors>
   */
  createSubbie(workshopSubcontractor: WorkshopSubcontractors): Observable<WorkshopSubcontractors> {
    if(!workshopSubcontractor) {
      throw new Error('vehicle service: you must supply a vehiclecheck object for saving');
    }

    delete workshopSubcontractor.createdAt;
    delete workshopSubcontractor.updatedAt;
    delete workshopSubcontractor.id;

    return this.httpClient.post(this._endpoint + 'workshop-subcontractors/',
    JSON.stringify(workshopSubcontractor),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <WorkshopSubcontractors>data;
    }));
  }
}
