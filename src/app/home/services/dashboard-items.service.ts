import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardItemsService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getEndingContractsForDateRange(startDate:string){
    return this.httpClient.get(this._endpoint + 'contract?filter=endDate||gte||' + startDate)
  }

  getNoOrdersForPeriod(startDate:string,endDate:string){
    return this.httpClient.get(
      this._endpoint + 'order?filter=date||gte||' + startDate +
      '&filter=date||lte||' + endDate +
      '&sort=date,DESC'
    )
  }

  getSalesPerPerson(startDate:string,endDate:string){
    return this.httpClient.get(
      this._endpoint + 'order?filter=date||gte||' + startDate +
      '&filter=date||lte||' + endDate +
      '&join=user||order.createdBy,user.id'
    )
  }
}
