import { Account } from 'src/app/order/models/account.model';

export class Fitter {
  id: number = -1;

  depotId: number = -1;

  depot: Account = new Account();
  driverBonusLevelId: number = -1;

  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  contact: string = '';
  employeeNumber: string = '';
  active: boolean = false;
  notes: string = '';

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
