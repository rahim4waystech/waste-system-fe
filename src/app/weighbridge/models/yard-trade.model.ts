import { Account } from 'src/app/order/models/account.model';

export class YardTrade {
  id: number = -1;

  customer: Account =  new Account();
  customerId: number = -1;

  depot: Account = new Account();
  depotId: number = -1;

  typeofTrade: number = 0;
  vehicleReg: string = '';
  ticketNumber: string = '';
  poNumber: string = '';
  grossWeight: number = 0;
  tareWeight: number = 0;;
  date: string = '';
  gradeId: number = -1;

  complianceIssue: boolean = false;
  complianceNotes: string = '';

  carriarSignature: string = '';
  carriarSignatureName: string = '';
  tippedSignature: string = '';
  tippedSignatureName: string = '';
  isSignedOff: boolean = false;


  createdAt: string = '';
  updatedAt: string = '';
}
