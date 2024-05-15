import { Invoice } from './invoice.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { OrderLine } from 'src/app/order/models/order-line.model';

export class InvoiceItem {
  id: number = -1;

  invoiceId: number = -1;
  jobId: number = -1;
  orderLineId: number;
  yardTradePricingId: number = -1;

  date: string = '';
  qty: number = 0;
  price: number = 0;
  nominalCode: string = '';
  longDescription: string = '';
  description: string = '';

  createdAt: string = '';
  updatedAt: string = '';
}
