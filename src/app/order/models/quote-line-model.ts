import { Product } from './product.model';

export class QuoteLine {
  id: number = -1;

  quoteId: number = -1;

  productId: number = -1;
  product: Product = new Product();

  qty: number = 0;
  newPrice: number = 0;


  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
