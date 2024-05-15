import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Incumbent } from '../models/incumbent.model';
import { AccountIncumbents } from '../models/account-incumbents.model';

@Injectable({
  providedIn: 'root'
})
export class IncumbentService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getAllIncumbents(){
    return this.httpClient.get(this._endpoint + 'incumbents')
  }

  /**
  * Add an Incumbent in the backend based on Incumbent object.
  * @param Incumbent Incumbent object.
  *
  * @returns Observable<Incumbent>
  */
 addIncumbent(incumbent: AccountIncumbents): Observable<AccountIncumbents> {
    if(!incumbent) {throw new Error('account service: you must supply a account object for saving');}

    delete incumbent.createdAt;
    delete incumbent.updatedAt;

    if(incumbent.id > 0) {throw new Error('incumbent service: Cannot create an existing object');}

    delete incumbent.id;

    return this.httpClient.post(this._endpoint + 'account-incumbent',
    JSON.stringify(incumbent),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <AccountIncumbents>data;
    }));
  }

  updateIncumbent(incumbent: AccountIncumbents): Observable<AccountIncumbents> {
    if(!incumbent) {throw new Error('incumbent service: you must supply a incumbent object for saving');}

    delete incumbent.updatedAt;

    if(!incumbent.id || incumbent.id === -1) {
      throw new Error('incumbent service: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'account-incumbent/' + incumbent.id,
    JSON.stringify(incumbent),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <AccountIncumbents>data;
    }));
  }

  getIncumbentsByAccountId(accountId:number): Observable<AccountIncumbents> {
   return this.httpClient.get(this._endpoint + 'account-incumbent?filter=active||eq||1&filter=accountId||eq||'+accountId).pipe(map((value: any) => {
      return <AccountIncumbents>value;
   }));
  }

}
