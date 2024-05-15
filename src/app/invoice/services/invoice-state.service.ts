import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceStateService {

  currentInvoiceChanged$: Subject<Invoice> = new Subject();
  constructor() { }
}
