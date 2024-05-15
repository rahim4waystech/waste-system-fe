import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Opportunity } from '../models/opportunity.model';
import { Lead } from 'src/app/leads/models/leads.model';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getAllOpps(){
    return this.httpClient.get(this._endpoint + 'opportunity');
  }

  /**
  * creates an opportunity in the backend based on opportunity object.
  * @param Opportunity opportunity object.
  *
  * @returns Observable<Opportunity>
  */
   createOpp(opportunity: Opportunity): Observable<Opportunity> {


    if(!opportunity) {
      throw new Error('Opportunity Service: you must supply a Opportunity object for saving');
    }

    delete opportunity.createdAt;
    delete opportunity.updatedAt;

    if(opportunity.id > 0) {
      throw new Error('Opportunity service: Cannot create an existing object');
    }

    delete opportunity.id;


    return this.httpClient.post(this._endpoint + 'opportunity',
    JSON.stringify(opportunity),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Opportunity>data;
    }));
  }

    /**
     * Get a Opportunity from the backend by id
     *
     * @param id number id of opportunity to get
     *
     * @returns Observable<Lead>
     */
    getOppById(id: number): Observable<Opportunity> {

      if(id <= 0 || id === null || id === undefined) {
        throw new Error('OpportunityService: Id must be a valid number');
      }

     return this.httpClient.get(this._endpoint + 'opportunity/' + id).pipe(map((value: any) => {
        return <Opportunity>value;
     }));
    }


      /**
       * updates an opportunity in the backend based on opportunity object.
       * @param Opportunity Opportunity object.
       *
       * @returns Observable<Opportunity>
       */
      updateOpp(opportunity: Opportunity): Observable<Opportunity> {


        if (!opportunity) {
          throw new Error('OpportunityService: you must supply a opportunity object for saving');
        }

        delete opportunity.updatedAt;

        if(opportunity.lead === null) {
          opportunity.lead = new Lead();
        }

        if (!opportunity.id || opportunity.id === -1) {
          throw new Error('OpportunityService: Cannot update an record without id');
        }

        return this.httpClient.put(this._endpoint + 'opportunity/' + opportunity.id,
          JSON.stringify(opportunity),
          { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
            return <Opportunity>data;
          }));
      }
}
