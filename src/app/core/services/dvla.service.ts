import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DvlaService {
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getByRegistration(registration:string){
    return this.httpClient.get('https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleData?v=2&api_nullitems=1&auth_apikey='+ environment.apiKeys.dvlaSearch +'&key_VRM=' + registration);
  }

  getByVin(vin:string){
    return this.httpClient.get('https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleData?v=2&api_nullitems=1&auth_apikey=' + environment.apiKeys.dvlaSearch + '&key_VIN=' + vin);
  }
}
