import { OrderType } from "src/app/order/models/order-type.model";

export class UserSkill {
    id: number = -1;
    userId: number = -1;
    orderTypeId: number = -1;
    orderType: OrderType = new OrderType();
    isPrimary: boolean = false;
    active: boolean = false;
    createdAt: string = '';
    updatedAt: string = '';
}