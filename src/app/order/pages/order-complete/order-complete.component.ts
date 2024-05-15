import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.scss']
})
export class OrderCompleteComponent implements OnInit {
  id: number = -1;

  order: Order = new Order();

  constructor(private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.loadOrder(this.id);
    })
  }

  loadOrder(id: number) {
    this.orderService.getOrderById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load order');
      return e;
    }))
    .subscribe((order: any) => {
      this.order = order;
      this.expireOrder();
    })
  }

  expireOrder(): void {
    this.order.orderStatus = {id: 4} as any;
    this.order.orderStatusId = 4;
    this.orderService.updateOrder(this.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Failed to decline order. Please try again later');
      return e;
    }))
    .subscribe(() => {
      this.router.navigateByUrl('/orders');
    })
  }

}
