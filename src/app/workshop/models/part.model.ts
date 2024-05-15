import { Account } from 'src/app/order/models/account.model';
import { PartCategory } from './part-category.model';

export class Part {
  id: number = -1;
  name:string = '';
  manufacturer:string = '';
  model:string = '';
  description:string = '';
  qty:number = 0;
  sku:string = '';
  manufacturerPartNumber:string = '';
  eanNumber:string = '';
  value:number = 0;
  depotId: number = -1;
  depot: Account = new Account();
  partCategoryId: number = -1;
  partCategory: PartCategory = new PartCategory();
  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
