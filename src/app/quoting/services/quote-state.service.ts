import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QuoteLine } from 'src/app/order/models/quote-line-model';

@Injectable({
  providedIn: 'root'
})
export class QuoteStateService {

  $newQuoteLineAdded: Subject<QuoteLine> = new Subject();
  constructor() { }
}
