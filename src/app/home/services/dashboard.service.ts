import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }

  /**
  * Get user dash from the backend by userId
  *
  * @param userId user to get dashboard for
  *
  * @returns Observable<Dashboard>
  */
  getActiveDashboardByUserId(userId: number): Observable<Dashboard> {

    if (userId <= 0 || userId === null || userId === undefined) {
      throw new Error('Dashboard Service: User Id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'dashboard?filter=active||eq||1&filter=userId||eq||' + userId).pipe(map((value: any) => {
      return <Dashboard>value;
    }));
  }

  /**
  * Get user dash from the backend by userId
  *
  * @param userId user to get dashboard for
  *
  * @returns Observable<Dashboard>
  */
  getAllDashboardByUserId(userId: number): Observable<Dashboard> {

    if (userId <= 0 || userId === null || userId === undefined) {
      throw new Error('Dashboard Service: User Id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'dashboard?filter=userId||eq||' + userId).pipe(map((value: any) => {
      return <Dashboard>value;
    }));
  }

  /**
   * updates a dashboard in the backend based on dashboard object.
   * @param dashboard  object.
   *
   * @returns Observable<Dashboard>
   */
  save(dashboard: Dashboard): Observable<Dashboard> {

    if(!dashboard) {
      throw new Error('Defect service: you must supply a Defect object for saving');
    }

    delete dashboard.updatedAt;

    if(!dashboard.id || dashboard.id === -1) {
      throw new Error('dashboard service: Cannot update a record without id');
    }

    return this.httpClient.put(this._endpoint + 'dashboard/' + dashboard.id,
    JSON.stringify(dashboard),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Dashboard>data;
    }));
  }

  /**
   * creates a dashboard check in the backend based on dashboard object.
   * @param dashboard object.
   *
   * @returns Observable<Dashboard>
   */
  create(dashboard: Dashboard): Observable<Dashboard> {
    if(!dashboard) {
      throw new Error('dashboard service: you must supply a dashboard object for saving');
    }
    delete dashboard.id;
    delete dashboard.updatedAt;
    delete dashboard.createdAt;

    return this.httpClient.post(this._endpoint + 'dashboard/',
    JSON.stringify(dashboard),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Dashboard>data;
    }));
  }
}
