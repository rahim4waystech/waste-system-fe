import { InvoiceStatus } from './invoice-status.model';
import { Account } from 'src/app/order/models/account.model';
import { OrderType } from 'src/app/order/models/order-type.model';
import { TaxType } from './tax-type.model';
import { InvoicePeriod } from './invoice-period.model';

export class Invoice {
  id: number = -1;

  invoiceStatus: InvoiceStatus = new InvoiceStatus();
  invoiceStatusId: number = -1;

  batchId: number = -1;
  ticketType:number = 1;

  account: Account = new Account();
  accountId: number = -1;

  site: Account = new Account();
  siteId: number = -1;

  orderType: OrderType = new OrderType();
  orderTypeId: number = -1;

  taxType: TaxType = new TaxType();
  taxTypeId: number = -1;

  invoicePeriod: InvoicePeriod = new InvoicePeriod();
  invoicePeriodId: number = -1;

  poNumber: string = '';
  invoiceDate: string = '';
  posted: boolean = false;
  postedDate: string = '';
  emailed: boolean = false;
  emailedDate: string= '';
  confirmation: boolean = false;
  loadEx: string = '';

  createdBy: number = -1;

  isAdditionalCharge: boolean = false;

  createdAt: string = '';
  updatedAt: string = '';
}
