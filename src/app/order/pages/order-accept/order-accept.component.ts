import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take, catchError } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Order } from '../../models/order.model';
import { Account } from 'src/app/order/models/account.model';
import { OrderLine } from '../../models/order-line.model';
import { CreditLimit } from 'src/app/account/models/credit-limit.model';


@Component({
  selector: 'app-order-accept',
  templateUrl: './order-accept.component.html',
  styleUrls: ['./order-accept.component.scss']
})
export class OrderAcceptComponent implements OnInit {

  id: number = -1;
  constructor(private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderService.acceptOrder(+params['id'])
      .pipe(take(1))
      .pipe(catchError((e) => {
       this.router.navigateByUrl('/orders');
        return e;
      }))
      .subscribe(() => {
        this.loadOrder(+params['id']);
        // this.router.navigateByUrl('/orders');
      })
    })
  }

  updateAccountCreditLimit(account: Account, order: Order) {
    // If the credit limit is enabled up date it to include the costings

    this.orderService.getOrderLinesByOrderId(order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load order lines');
      return e;
    }))
    .subscribe((orderLines: OrderLine[]) => {
      let totalCost = 0;

      orderLines.forEach((line: OrderLine) => {
        totalCost += line.price * line.qty;
      })

      this.setAccountLimit(totalCost, order.accountId);

    })

  }

  setAccountLimit(totalCost: number, accountId: number) {
    this.accountService.getCreditLimit(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load account limit');
      return e;
    }))
    .subscribe((limit: CreditLimit) => {
      limit[0].usedCredit += totalCost;

      this.accountService.updateCreditLimit(limit[0])
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not update account');
        return e;
      }))
      .subscribe(() => {
        this.router.navigateByUrl('/orders');
      })
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
    .subscribe((order: Order) => {
      this.accountService.getAccountById(order.accountId)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not load account');
        return e;
      }))
      .subscribe((account: Account) => {
        if(account.limitEnabled) {
          this.updateAccountCreditLimit(account, order);
        } else {
            this.router.navigateByUrl('/orders');
        }
      })
    })
  }

}
