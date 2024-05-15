import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Personalisation } from '../models/personalisation.model';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  /**
   * Get an Personalisation object from the backend by user id
   *
   * @param id number userid of user settings to get
   *
   * @returns Observable<Personalisation>
   */
  getSettingsByUserId(id: number): Observable<Personalisation> {

    if(id <= 0 || id === null || id === undefined) {
      throw new Error('Personalisation: userId must be a valid number');
    }

   return this.httpClient.get(this._endpoint + 'user-settings?filter=userId||eq||' + id).pipe(map((value: any) => {
      return <Personalisation>value;
   }));
  }

  /**
   * creates a personalisation in the backend based on Personalisation object.
   * @param personalisation  object.
   *
   * @returns Observable<Personalisation>
   */
  createPersonalisation(personalisation: Personalisation): Observable<Personalisation> {
    if(!personalisation) {
      throw new Error('personalisation service: you must supply a personalisation object for saving');
    }


    if(personalisation.userId === -1) {
      throw new Error('personalisation service must have a user ID');
    }

    delete personalisation.id;
    delete personalisation.createdAt;
    delete personalisation.updatedAt;

    return this.httpClient.post(this._endpoint + 'user-settings',
    JSON.stringify(personalisation),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Personalisation>data;
    }));
  }

  /**
   * updates a personalisation in the backend based on Personalisation object.
   * @param personalisation  object.
   *
   * @returns Observable<Personalisation>
   */
  updatePersonalisation(personalisation: Personalisation): Observable<Personalisation> {
    if(!personalisation) {
      throw new Error('personalisation service: you must supply a personalisation object for saving');
    }

    if(personalisation.userId === -1) {
      throw new Error('personalisation service must have a user ID');
    }

    delete personalisation.updatedAt;

    return this.httpClient.put(this._endpoint + 'user-settings/' + personalisation.id,
    JSON.stringify(personalisation),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Personalisation>data;
    }));
  }
}
