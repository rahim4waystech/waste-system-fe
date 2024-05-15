import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Lead } from '../models/leads.model';
import { LeadStatus } from '../models/lead-status.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  /**
   * Get a Lead from the backend by id
   *
   * @param id number id of Lead to get
   *
   * @returns Observable<Lead>
   */
  getLeadById(id: number): Observable<Lead> {

    if(id <= 0 || id === null || id === undefined) {
      throw new Error('LeadService: Id must be a valid number');
    }

   return this.httpClient.get(this._endpoint + 'lead/' + id).pipe(map((value: any) => {
      return <Lead>value;
   }));
  }

  /**
   * Get a Lead from the backend by id
   *
   * @param id number accountId of Lead to get
   *
   * @returns Observable<Lead>
   */
  getLeadByAccountId(id: number): Observable<Lead> {

    if(id <= 0 || id === null || id === undefined) {
      throw new Error('LeadService: Id must be a valid number');
    }

   return this.httpClient.get(this._endpoint + 'lead?filter=accountId||eq||' + id).pipe(map((value: any) => {
      return <Lead>value;
   }));
  }

  /**
  * creates a account in the backend based on account object.
  * @param Account account object.
  *
  * @returns Observable<Account>
  */
   createLead(lead: Lead): Observable<Lead> {


    if(!lead) {
      throw new Error('Lead Service: you must supply a Lead object for saving');
    }

    delete lead.createdAt;
    delete lead.updatedAt;

    if(lead.id > 0) {
      throw new Error('Lead service: Cannot create an existing object');
    }

    delete lead.id;


    return this.httpClient.post(this._endpoint + 'lead',
    JSON.stringify(lead),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Lead>data;
    }));
  }

  /**
   * updates a order in the backend based on order object.
   * @param order order object.
   *
   * @returns Observable<Order>
   */
  saveLead(lead: Lead): Observable<Lead> {


    if (!lead) {
      throw new Error('LeadService: you must supply a Lead object for saving');
    }

    delete lead.updatedAt;

    if (!lead.id || lead.id === -1) {
      throw new Error('LeadService: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'lead/' + lead.id,
      JSON.stringify(lead),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <Lead>data;
      }));
  }

  getLeadStatus(): Observable<LeadStatus> {
    return this.httpClient.get(this._endpoint + 'lead-status').pipe(map((value: any) => {
      return <LeadStatus>value;
    }));
  }
}
