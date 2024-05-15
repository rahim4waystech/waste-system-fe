import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  /**
   * Endpoint for http calls
   */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getAssetUtilisation(startDate,endDate) {
    const data = {startDate:startDate,endDate:endDate}
    return this.httpClient.post(this._endpoint + 'reporting/utilisation',JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}});
  }

  getNetIncomeByVehicle(startDate,endDate) {
    const data = {startDate:startDate,endDate:endDate}
    return this.httpClient.post(this._endpoint + 'reporting/netIncomeByVehicle',JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}});
  }

  getDebtorsReport(startDate,endDate) {
    const data = {startDate:startDate,endDate:endDate}
    return this.httpClient.post(this._endpoint + 'reporting/debtorsReportByDateRange',JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}});
  }

  getDefectStatus(){
    return this.httpClient.get(this._endpoint + 'reporting/defectStats');
  }
}
