import { Order } from './order.model';
import { OrderStatus } from './order-status.model';
import { User } from 'src/app/auth/models/user.model';

export class OrderStatusHistory {
  id: number = -1;

  orderId: number = -1;
  order: Order = new Order();

  orderStatusId: number = -1;
  orderStatus: OrderStatus = new OrderStatus();

  notes: string = '';

  createdBy: number = -1;
  user: User = new User();


  createdAt: string = '';
  updatedAt: string = '';

}
