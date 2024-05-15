import { Account } from "./account.model";
import { Unit } from "./unit.model";

export class MaterialUplift {
    id: number = -1;

    accountId: number = -1;
    account: Account = new Account();

    orderId: number = -1;
    unitId: number = -1;
    unit: Unit = new Unit();
    price: number = 0;
    qty: number = 1;
    name: string = '';
  
    createdBy: number = -1;
  
    createdAt: string = '';
    updatedAt: string = '';
}