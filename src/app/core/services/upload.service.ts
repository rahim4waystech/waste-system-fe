import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }



  uploadFile(data: any, type: string, entityId: number) {
    return this.httpClient.post(this._endpoint + 'documents/upload/' + type + '/' + entityId, JSON.stringify(data),{headers: {'Content-Type': 'application/json'}})
  }

  uploadAppFile(data: any, type: string, entityId: number) {
    return this.httpClient.post(this._endpoint + 'documents/upload/app/' + type + '/' + entityId, data);
  }



}
