import { Injectable } from '@angular/core';
import { HeaderItem } from '../models/header-item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

/**
 * This class is used for all header state through out the app
 *
 * @author Four Ways Technology
 */
@Injectable({
  providedIn: 'root'
})
export class AddressPickerService {
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getPostcode(postcode:string){
    return this.httpClient.get('https://api.getAddress.io/find/' + postcode + '?api-key=' + environment.apiKeys.getAddress + '&expand=true');
  }
}
