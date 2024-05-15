import { Order } from "./order.model";

export class OrderProvision {
    id: number = -1;
  
    orderId: number = -1;
    order: Order = new Order();
    
    unitId: number = -1;
    date: string = '';
    amount: number = 0;
    notes: string = '';
    allocated: number = 0;


    createdBy: number = -1;
    createdAt: string = '';
    updatedAt: string = '';
  }
  