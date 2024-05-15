import { YardTrade } from './yard-trade.model';
import { QuoteLine } from 'src/app/order/models/quote-line-model';

export class YardTradePricing {
  id: number = -1;

  yardTradeId: number = -1;
  yardTrade: YardTrade = new YardTrade();

  quoteLineId: number = -1;
  quoteLine: QuoteLine = new QuoteLine();

  unitId: number = -1;
  qty: number = 0;
  price: number = 0;
  name: string = '';


  createdAt: string = '';
  updatedAt: string = '';
}
