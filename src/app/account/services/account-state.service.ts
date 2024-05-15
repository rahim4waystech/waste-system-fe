import { Injectable } from '@angular/core';
import { TippingPrice } from '../models/tipping-price.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountStateService {

  $tippingPriceAdded: Subject<TippingPrice> = new Subject();
  constructor() { }
}
