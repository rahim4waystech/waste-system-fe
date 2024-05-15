import { Account } from "src/app/order/models/account.model";
import { Unit } from "src/app/order/models/unit.model";

export class PriceListItem {
    id: number = -1;

    priceListId: number = -1;
    
    name: string = '';
    price: number = 0;
    unitId: number = -1;
  
    unit: Unit = new Unit();
    
    siteId: number = -1;
  
    site: Account = new Account();
  
  
    active: boolean = false;
  
    createdAt: string = '';
    updatedAt: string = '';
}