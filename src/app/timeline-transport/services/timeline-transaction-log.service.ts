import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TimelineTransactionLog } from '../models/timeline-transaction-log.model';

@Injectable({
  providedIn: 'root'
})
export class TimelineTransactionLogService {

  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  createLog(log: TimelineTransactionLog): Observable<TimelineTransactionLog> {


    if(!log) {
      throw new Error('timeline transaction service: you must supply a log object for saving');
    }
 
    delete log.createdAt;
    delete log.updatedAt;
 
    if(log.id > 0) {
      throw new Error('timeline transaction service: Cannot create a existing object');
    }
 
    delete log.id;
    return this.httpClient.post(this._endpoint + 'timeline-transaction-log',
    JSON.stringify(log),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <TimelineTransactionLog>data;
    }));
  }
}
