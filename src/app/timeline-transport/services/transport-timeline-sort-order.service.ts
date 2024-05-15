import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TransportTimeLineSortOrder } from '../models/transport-timeline-sort-order';

@Injectable({
  providedIn: 'root'
})
export class TransportTimelineSortOrderService {

  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  bulkCreate(transportTimelineSortOrder: TransportTimeLineSortOrder[]) {
    if(!transportTimelineSortOrder || transportTimelineSortOrder.length === 0) {
      throw new Error('You must provide valid sort order objects to save');
    }

    return this.httpClient.post(this._endpoint + 'transport-timeline-sort-order/bulk', {bulk: transportTimelineSortOrder},
    {headers: {'Content-Type': 'application/json'}});
  }

  deleteAll() {
    return this.httpClient.delete(this._endpoint + 'transport-timeline-sort-order/deleteAll');
  }
}
