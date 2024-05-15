import { User } from 'src/app/auth/models/user.model';
import { Account } from 'src/app/order/models/account.model';
import { LeadStatus } from './lead-status.model';
import { AccountType } from 'src/app/order/models/account-type.model';
import { Contact } from 'src/app/contact/models/contact.model';

export class Lead {
  id: number = -1;
  subject: string = '';
  estimatedRevenue: number = 0;
  ownerId: number = -1;
  owner: User = new User();
  leadSource: string = '';
  phone: string = '';
  email: string = '';
  accountId: number = -1;
  account: Account = new Account();
  contactId: number = -1;
  contact: Contact = new Contact();
  typeId: number = -1;
  type: AccountType = new AccountType();
  statusId: number = -1;
  status: LeadStatus = new LeadStatus();
  leadNotes: string = '';

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
