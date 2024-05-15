import { Injectable } from '@angular/core';
import { Subcontractor } from '../models/subcontractor.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubcontractorService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }
 /**
  * Get a subcontractor from the backend by id
  *
  * @param id number id of subcontractor to get
  *
  * @returns Observable<Subcontractor>
  */
 getSubcontractorById(id: number): Observable<Subcontractor> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('SubcontactorService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'subcontractor/' + id).pipe(map((value: any) => {
    return <Subcontractor>value;
 }));
}


/**
 * creates a subcontractor in the backend based on subcontractor object.
 * @param Subcontractor subcontractor object.
 *
 * @returns Observable<Subcontractor>
 */
createSubcontractor(subcontractor: Subcontractor): Observable<Subcontractor> {


  if(!subcontractor) {
    throw new Error('subcontractor service: you must supply a subcontractor object for saving');
  }

  delete subcontractor.createdAt;
  delete subcontractor.updatedAt;

  if(subcontractor.id > 0) {
    throw new Error('subcontractor service: Cannot create a existing object');
  }

  delete subcontractor.id;
  return this.httpClient.post(this._endpoint + 'subcontractor',
  JSON.stringify(subcontractor),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Subcontractor>data;
  }));
}


/**
 * updates a subcontactor in the backend based on subcontractor object.
 * @param subcontractor subcontractor object.
 *
 * @returns Observable<Subcontractor>
 */
updateSubcontractor(subcontractor: Subcontractor): Observable<Subcontractor> {


  if(!subcontractor) {
    throw new Error('subcontractor service: you must supply a subcontractor object for saving');
  }

  delete subcontractor.createdAt;
  delete subcontractor.updatedAt;

  if(!subcontractor.id || subcontractor.id === -1) {
    throw new Error('subcontractor service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'subcontractor/' + subcontractor.id,
  JSON.stringify(subcontractor),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Subcontractor>data;
  }));
}

getAllSubcontractors(): Observable<Subcontractor[]> {
  return this.httpClient.get(this._endpoint + 'subcontractor?sort=name,ASC&filter=parentId||eq||-1').pipe(map((data) => {
    return <Subcontractor[]>data;
  }));
}

getAllSubcontractorsDepots(id: number=-1): Observable<Subcontractor[]> {
  return this.httpClient.get(this._endpoint + 'subcontractor?filter=parentId||eq||' + id).pipe(map((data) => {
    return <Subcontractor[]>data;
  }));
}
getPaginatedSubcontractors(page:number,limit:number){
  return this.httpClient.get(this._endpoint + 'subcontractor?page='+page+'&limit='+limit).pipe(map((data) => {
    return data;
  }));
}
}
