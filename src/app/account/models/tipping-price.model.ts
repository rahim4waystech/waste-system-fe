import { Account } from 'src/app/order/models/account.model';
import { Grade } from 'src/app/container/models/grade.model';
import { Unit } from 'src/app/order/models/unit.model';

export class TippingPrice {
  id: number = -1;

  site: Account = new Account();
  siteId: number = -1;

  grade: Grade = new Grade();
  gradeId: number = -1;

  unit: Unit = new Unit();
  unitId: number = -1;

  effectiveDate: string = null;

  price: number = 0;

  createdAt: string = '';
  updatedAt: string = '';
}
