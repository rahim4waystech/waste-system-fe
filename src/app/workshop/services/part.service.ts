import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PartAssignment } from 'src/app/core/models/part-assignment.model';
import { environment } from 'src/environments/environment';
import { PartCategory } from '../models/part-category.model';
import { Part } from '../models/part.model';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) {

  }

  /**
   * creates a part in the backend based on part object.
   * @param Part part object.
   *
   * @returns Observable<Part>
   */
  addPart(part: Part): Observable<Part> {
    if(!part) {
      throw new Error('parts service: you must supply a part object for saving');
    }

    delete part.id;
    delete part.updatedAt;
    delete part.createdAt;

    return this.httpClient.post(this._endpoint + 'parts/',
    JSON.stringify(part),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Part>data;
    }));
  }

  /**
   * Updates a part check in the backend based on part object.
   * @param Part part object.
   *
   * @returns Observable<Part>
   */
  updatePart(part: Part): Observable<Part> {
    if(!part) {
      throw new Error('parts service: you must supply a part object for saving');
    }

    if(!part.id || part.id === -1) {
      throw new Error('Part service: Cannot update a record without id');
    }

    delete part.updatedAt;

    return this.httpClient.put(this._endpoint + 'parts/' + part.id,
    JSON.stringify(part),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Part>part;
    }));
  }

  getAssignmentsByVehicleId(vehicleId):Observable<PartAssignment> {
    if(vehicleId === -1) {
      throw new Error('parts service: you must supply an ID');
    }

    return this.httpClient.get(this._endpoint + 'part-assignment?filter=vehicleId||eq||' + vehicleId).pipe(map((data) => {
      return <PartAssignment>data;
    }));
  }

  getAssignmentsByDefectId(defectId):Observable<PartAssignment> {
    if(defectId === -1) {
      throw new Error('parts service: you must supply an ID');
    }

    return this.httpClient.get(this._endpoint + 'part-assignment?filter=defectId||eq||' + defectId).pipe(map((data) => {
      return <PartAssignment>data;
    }));
  }

  getAllPartsInStock(){
    return this.httpClient.get(this._endpoint + 'parts?filter=qty||gt||0').pipe(map((data) => {
      return <Part>data;
    }));
  }

  getPartById(id:number){
    return this.httpClient.get(this._endpoint + 'parts?filter=id||eq||' + id).pipe(map((data) => {
      return <Part>data;
    }));
  }

  assignPart(assignment:PartAssignment): Observable<PartAssignment> {
    if(!assignment) {
      throw new Error('parts service: you must supply a part assignment object for saving');
    }

    delete assignment.id;
    delete assignment.updatedAt;
    delete assignment.createdAt;

    return this.httpClient.post(this._endpoint + 'part-assignment/',
    JSON.stringify(assignment),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <PartAssignment>data;
    }));
  }

  getAllPartCategories():Observable<PartCategory>{
    return this.httpClient.get(this._endpoint + 'part-category').pipe(map((data) => {
      return <PartCategory>data;
    }));
  }

  /**
   * creates a partCategory in the backend based on partCategory object.
   * @param PartCategory partCategory object.
   *
   * @returns Observable<PartCategory>
   */
  createPartCategory(partCategory: PartCategory): Observable<PartCategory> {
    if(!partCategory) {
      throw new Error('parts service: you must supply a partCategory object for saving');
    }

    delete partCategory.id;
    delete partCategory.updatedAt;
    delete partCategory.createdAt;

    return this.httpClient.post(this._endpoint + 'part-category/',
    JSON.stringify(partCategory),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <PartCategory>data;
    }));
  }

  /**
   * creates a partCategory in the backend based on partCategory object.
   * @param Part PartCategory object.
   *
   * @returns Observable<PartCategory>
   */
  updatePartCategory(partCategory: PartCategory): Observable<PartCategory> {
    if(!partCategory) {
      throw new Error('parts service: you must supply a partCategory object for saving');
    }
    delete partCategory.updatedAt;

    return this.httpClient.put(this._endpoint + 'part-category/'+partCategory.id,
    JSON.stringify(partCategory),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <PartCategory>data;
    }));
  }
}
