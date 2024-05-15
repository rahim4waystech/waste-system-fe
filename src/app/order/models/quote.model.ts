import { Account } from './account.model';

export class Quote {
  id: number = -1;

  accountId: number = -1;
  account: Account = new Account();

  leadId: number = -1;
  opportunityId: number = -1;
  statusId: number = 1;
  quoteStatus: any = {};

  name: string = '';
  quoteNumber: string = '';
  description: string = '';
  validFrom: string = '';
  validTo: string = '';
  closedOn: string = '';
  discountAmount: number = 0;

  companyName: string = '';
  contactName: string = '';
  contactTelephone: string = '';
  contactEmail: string = '';
  contactAddressLine1: string = '';
  contactAddressLine2: string = '';
  contactAddressLine3: string = '';
  contactCity: string = '';
  contactCountry: string = '';
  contactPostCode: string = '';

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
