import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { take, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-decline',
  templateUrl: './order-decline.component.html',
  styleUrls: ['./order-decline.component.scss']
})
export class OrderDeclineComponent implements OnInit {

  reason: string = '';
  id: number = -1;


  constructor(private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
    })
  }

  onDeclineClicked(): void {
    this.orderService.declineOrder(this.id, '')
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
