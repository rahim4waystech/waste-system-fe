import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Recurrence } from '../models/recurrence.model';

@Injectable({
  providedIn: 'root'
})
export class RecurrenceService {
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getByRecurrenceId(id:number):Observable<Recurrence>{
    return this.httpClient.get(this._endpoint + 'recurrence?filter=id||eq||'+id).pipe(map((value:any)=>{
      return <Recurrence>value;
    }))
  }

  save(recurrence:Recurrence):Observable<Recurrence>{
    if(!recurrence) {
      throw new Error('recurrence service: you must supply a recurrence object for saving');
    }


    delete recurrence.createdAt;
    delete recurrence.updatedAt;
    delete recurrence.createdBy;

    if(recurrence.id > 0) {
      throw new Error('discussion service: Cannot create a existing object');
    }

    delete recurrence.id;

    return this.httpClient.post(this._endpoint + 'recurrence',
    JSON.stringify(recurrence),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Recurrence>data;
    }));
    return
  }

  update(recurrence:Recurrence):Observable<Recurrence>{
    if(!recurrence) {
      throw new Error('recurrence service: you must supply a recurrence object for saving');
    }

    delete recurrence.updatedAt;


    if(!recurrence.id || recurrence.id === -1) {
      throw new Error('recurrence service: Cannot update a record without id');
    }

    return this.httpClient.put(this._endpoint + 'recurrence/' + recurrence.id,
    JSON.stringify(recurrence),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Recurrence>data;
    }));
  }
}
