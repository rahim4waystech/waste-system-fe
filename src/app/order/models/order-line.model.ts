import { Order } from './order.model';
import { QuoteLine } from './quote-line-model';

export class OrderLine {
  id: number = -1;

  orderId: number = -1;
  order: Order = new Order();

  quoteLineId: number = -1;
  quoteLine: QuoteLine = new QuoteLine();

  qty: number = 0;
  price: number = 0;
  isPrimaryCharge: boolean = false;
  overweight: boolean = false;

  name: string = '';
  unitId: number = -1;

  createdAt: string = '';
  updatedAt: string = '';
}
