import { Recurrence } from 'src/app/core/models/recurrence.model';
import { Account } from 'src/app/order/models/account.model';

export class Contract {
  public id: number = -1;
  public contractTypeId: number = -1;
  public contractStatusId: number = -1;
  public accountId: number = -1;
  public account: Account = new Account();
  public startDate: string = '';
  public endDate: string = '';
  public contractNumber: number = 0;
  public name: string = '';
  public riskLevel: number = 0;
  public bagsNo: number = 0;
  public cabinetNo: number = 0;
  public contractRef: string = '';

  public recurrenceId: number = -1;
  public recurrence: Recurrence = new Recurrence();

  public createdAt: string = '';
  public updatedAt: string = '';
}
