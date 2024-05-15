import { User } from 'src/app/auth/models/user.model';
import { QuoteStatus } from './quote-status.model';
import { Quote } from 'src/app/order/models/quote.model';

export class QuoteStatusHistory {
  id: number = -1;

  quoteId: number = -1;
  quote: Quote = new Quote();

  quoteStatusId: number = -1;
  quoteStatus: QuoteStatus = new QuoteStatus();

  notes: string = '';

  createdBy: number = -1;
  user: User = new User();


  createdAt: string = '';
  updatedAt: string = '';

}
