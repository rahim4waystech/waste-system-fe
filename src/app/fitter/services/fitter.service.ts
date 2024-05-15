import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Fitter } from '../models/fitter.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class FitterService {


    /**
    * Endpoint for http calls
    */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }


  getAllFitters() {
    return this.httpClient.get(this._endpoint + 'fitter?filter=active||eq||1').pipe(map((value: any) => {
      return <Fitter>value;
   }));
  }

  getFitterById(id: number): Observable<Fitter> {

    if(id <= 0 || id === null || id === undefined) {
      throw new Error('FitterService: Id must be a valid number');
    }

   return this.httpClient.get(this._endpoint + 'fitter/' + id).pipe(map((value: any) => {
      return <Fitter>value;
   }));
  }

 createFitter(fitter: Fitter): Observable<Fitter> {


  if(!fitter) {
    throw new Error('fitter service: you must supply a fitter object for saving');
  }

  delete fitter.createdAt;
  delete fitter.updatedAt;

  if(fitter.id > 0) {
    throw new Error('fitter service: Cannot create a existing object');
  }

  delete fitter.id;
  return this.httpClient.post(this._endpoint + 'fitter',
  JSON.stringify(fitter),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Fitter>data;
  }));
}


updateFitter(fitter: Fitter): Observable<Fitter> {


  if(!fitter) {
    throw new Error('fitter service: you must supply a fitter object for saving');
  }

  if(fitter.depot === null) {
    fitter.depot = new Account();
  }
  delete fitter.updatedAt;

  if(!fitter.id || fitter.id === -1) {
    throw new Error('fitter service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'fitter/' + fitter.id,
  JSON.stringify(fitter),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Fitter>data;
  }));
}
}
