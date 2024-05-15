import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentSettings } from '../models/environment-settings.model';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) {

   }




  /**
   * Get an ENV object from the backend by organisation id
   *
   * @param id number id of ENV to get
   *
   * @returns Observable<Environment>
   */
  getEnvironmentById(id: number): Observable<EnvironmentSettings> {

    if(id <= 0 || id === null || id === undefined) {
      throw new Error('Environment: OrgId must be a valid number');
    }

   return this.httpClient.get(this._endpoint + 'environment-settings/?filter=id||eq||' + id).pipe(map((value: any) => {
      return <EnvironmentSettings>value;
   }));
  }

  /**
   * updates an ENV in the backend based on environment object.
   * @param environment environment object.
   *
   * @returns Observable<EnvironmentSettings>
   */
  newEnv(environment: EnvironmentSettings): Observable<EnvironmentSettings> {

    if(!environment) {
      throw new Error('environment service: you must supply a environment object for saving');
    }

    delete environment.id;
    delete environment.createdAt;
    delete environment.updatedAt;
    return this.httpClient.post(this._endpoint + 'environment-settings',
    JSON.stringify(environment),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <EnvironmentSettings>data;
    }));
    return;
  }

  /**
   * updates an ENV in the backend based on environment object.
   * @param environment environment object.
   *
   * @returns Observable<EnvironmentSettings>
   */
  updateEnv(environment: EnvironmentSettings): Observable<EnvironmentSettings> {


    if(!environment) {
      throw new Error('environment service: you must supply a environment object for saving');
    }

    delete environment.updatedAt;

    if(!environment.id || environment.id === -1) {
      throw new Error('environment service: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'environment-settings/' + environment.id,
    JSON.stringify(environment),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <EnvironmentSettings>data;
    }));
  }
}
