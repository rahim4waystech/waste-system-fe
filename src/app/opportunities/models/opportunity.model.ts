import { LeadStatus } from 'src/app/leads/models/lead-status.model';
import { User } from 'src/app/auth/models/user.model';
import { Lead } from 'src/app/leads/models/leads.model';
import { Account } from 'src/app/order/models/account.model';
import { Contact } from 'src/app/contact/models/contact.model';

export class Opportunity {
  id: number = -1;
  opportunityName: string = '';
  description: string = '';
  phone: string = '';
  email: string = '';
  statusId: number = -1;
  status: LeadStatus = new LeadStatus();
  leadId: number = -1;
  lead: Lead = new Lead();
  account: Account = new Account();
  accountId:number = -1;
  contact: Contact = new Contact();
  contactId: number = -1;
  ownerId: number = -1;
  owner: User = new User();
  estimatedCloseDate: string = '';
  actualClosedDate: string = null;
  actualRevenue: number = 0;

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
