import { Account } from "src/app/order/models/account.model";

export class PriceList {
    id: number = -1;
    name: string = '';
  
    accountId: number = -1;
  
    account: Account = new Account();
  
    active: boolean = false;
  
    createdAt: string = '';
    updatedAt: string = '';
}