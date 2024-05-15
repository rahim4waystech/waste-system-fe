import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getFleetDefectInfo(){
    return this.httpClient.get(this._endpoint)
  }


}
