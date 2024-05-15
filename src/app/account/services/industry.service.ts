import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;

 constructor(private httpClient: HttpClient) { }

 getAll(){
  return this.httpClient.get(this._endpoint + 'industry?sort=name,ASC');
}

}
