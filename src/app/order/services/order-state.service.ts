import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Grade } from 'src/app/container/models/grade.model';
import { MaterialUplift } from '../models/material-uplift.model';
import { OrderLine } from '../models/order-line.model';
import {Account} from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class OrderStateService {

  quoteIdChanged$: Subject<number> = new Subject<number>();
  orderLinesChanged$: Subject<OrderLine[]> = new Subject<OrderLine[]>();
  orderLineAdded$: Subject<OrderLine> = new Subject<OrderLine>();
  gradeAdded$: Subject<Grade> = new Subject<Grade>();
  materialUpliftAdded$: Subject<MaterialUplift> = new Subject<MaterialUplift>();
  companyAdded$: Subject<Account> = new Subject<Account>();
  siteAdded$: Subject<Account> = new Subject<Account>();
  siteAndCompanyAdded$: Subject<Account> = new Subject<Account>();
  constructor() { }
}
