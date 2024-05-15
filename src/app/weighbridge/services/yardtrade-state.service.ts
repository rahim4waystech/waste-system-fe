import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { YardTradePricing } from '../models/yard-trade-pricing.model';

@Injectable({
  providedIn: 'root'
})
export class YardtradeStateService {

  $ItemAdded: Subject<YardTradePricing> = new Subject();
  constructor() { }
}
