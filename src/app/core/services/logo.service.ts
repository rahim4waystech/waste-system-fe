import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogoService {

  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getLogoFromWebsite(website:string='') {
    return this.httpClient.post("https://www.klazify.com/api/categorize", {url: website}, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + environment.apiKeys.logo,
        'Content-Type': "application/json",
      }
    })
    .pipe(map((data: any) => {
      return data.domain.logo_url;
    }))

  }
}
