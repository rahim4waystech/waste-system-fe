import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniesHouseService {

  /* https://api.companieshouse.gov.uk/search/companies*/

  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getCompany(query:string){
    return this.httpClient.get('https://api.company-information.service.gov.uk/search/companies?q=' + encodeURIComponent(query) + "&items_per_page=30",{
      headers: {
        'Authorization': 'Basic ' + btoa(environment.apiKeys.companiesHouse + ':'),
      }
    });
  }

  getCompanyById(companyNumber: string) {
    return this.httpClient.get('https://api.company-information.service.gov.uk/company/' + companyNumber,{
      headers: {
        'Authorization': 'Basic ' + btoa(environment.apiKeys.companiesHouse + ':'),
      }
    });
  }
}
