import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { OrderValidatorService } from '../../validators/order-validator.service';
import { OrderStateService } from '../../services/order-state.service';
import { OrderService } from '../../services/order.service';
import { take, catchError } from 'rxjs/operators';
import { OrderLine } from '../../models/order-line.model';
import { CreditLimit } from 'src/app/account/models/credit-limit.model';
import { AccountService } from 'src/app/account/services/account.service';
import { environment } from 'src/environments/environment';
import { MaterialUplift } from '../../models/material-uplift.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-order-copy',
  templateUrl: './order-copy.component.html',
  styleUrls: ['./order-copy.component.scss']
})
export class OrderCopyComponent implements OnInit {
  order: Order = new Order();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  orderLines: any = {orderLines: []};
  warningForCreditLimit = false;

  creditLimit: CreditLimit = new CreditLimit();
  materialUplifts: any = {materialUplifts: []};

constructor(private route: ActivatedRoute,
  private accountService: AccountService,
    private orderValidator: OrderValidatorService,
    private orderStateService: OrderStateService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadOrder(+params['id'], params['accountId'], params['siteId']);
    });

  }

  loadAccount(id: number=-1, siteId: number=-1) {
    this.accountService.getAccountById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((account: Account) => {
      this.order.account = account;
      this.order.accountId = account.id;

      this.loadSite(siteId);
    });
  }

  loadSite(id: number=-1) {
    this.accountService.getAccountById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((account: Account) => {
      this.order.site = account;
      this.order.siteId = account.id;
    });
  }

  loadOrder(id: number, accountId: number=-1, siteId: number=-1): void {
    this.orderService.getOrderById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((order: Order) => {
      this.order = order;
      this.order.date = '';

      if(accountId !== -1 && accountId !== null && accountId !== undefined) {
        this.loadAccount(accountId, siteId);
      }

      this.loadCreditLimit();
      this.loadOrderLines();
      this.loadMaterialUplifts();
    })
  }

  loadCreditLimit() {
    this.accountService.getCreditLimit(this.order.accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get credit limit');
      return e;
    }))
    .subscribe((creditLimit: CreditLimit) => {
      this.creditLimit = creditLimit[0];


      if(this.creditLimit) {
        const load = (this.creditLimit.usedCredit) / this.creditLimit.maxCredit;

        // 20 % credit limit check
        if(load >= 0.8) {
          this.warningForCreditLimit = true;
        }
      }
    })
  }

  loadOrderLines() {
    this.orderService.getOrderLinesByOrderId(this.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((orderLines: OrderLine[]) => {
      this.orderLines.orderLines = orderLines;

      this.orderStateService.orderLinesChanged$.next(orderLines);


      // Make sure correct quoteId is extracted from quote assume one quote per order
      if(this.orderLines.orderLines.length > 0) {
        const quoteId = this.orderLines.orderLines[0].quoteLine.quoteId;
        this.orderStateService.quoteIdChanged$.next(quoteId);
      }
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.orderValidator.isDataValid(this.order, this.orderLines)) {


      const orderlinesSave = this.orderLines.orderLines.filter(o => o.qty > 0 || o.isPrimaryCharge);

      // Check for limits
      if(this.order.account.limitEnabled) {

        let total = 0;
        orderlinesSave.forEach((orderLine: OrderLine) => {
          total += orderLine.price * orderLine.qty;
        });

        if(total + this.creditLimit.usedCredit > this.creditLimit.maxCredit) {
          alert('Credit limit exceeded for account. This order cannot go forward');
          return;
        }
      }

      // try to save it
      this.order.id = -1;
      this.order.orderStatusId = 1;
      this.order.orderStatus.id = 1;
      this.order.createdBy = -1;
      this.order.orderAllocated = false;

      // if ynd box auto accept
      if(environment.invoicing.companyName === 'Yuill & Dodds Ltd') {
        this.order.orderStatusId = 2;
        this.order.orderStatus.id = 2;
      }

      this.orderService.createOrder(this.order)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((order: Order) => {
        const orderlinesSave = this.orderLines.orderLines.filter(o => o.qty > 0);

        orderlinesSave.forEach(orderLine => {
          orderLine.order.id = order.id;
          orderLine.orderId = order.id;
          orderLine.id = -1;
        });

        this.materialUplifts.materialUplifts.forEach((uplift: any) => {
          uplift.orderId = order.id;
        });


      this.bulkSaveOrderLines(this.orderLines.orderLines);
      })
    } else {
      this.isError = true;
    }
  }

  bulkSaveMaterialUplifts(materialUplifts: MaterialUplift[]) {

    this.orderService.createBulkUplifts(materialUplifts)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not create uplifts');
      return e;
    }))
    .subscribe(() => {
      window.location.href = '/orders';
    })
  }

  loadMaterialUplifts() {
    this.orderService.getUpliftsByOrderId(this.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((uplifts: MaterialUplift[]) => {
      this.materialUplifts.materialUplifts = uplifts;

      this.materialUplifts.materialUplifts.forEach((uplift: any) => {
        uplift.id = -1;
      })
    });
  }

  bulkSaveOrderLines(orderLines: OrderLine[]) {
    if(!orderLines) {
      this.isServerError = true;
    }

    this.orderService.createBulkOrderLines(orderLines)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {

      if(this.materialUplifts.materialUplifts.length === 0) {
        window.location.href = '/orders';
      } else {
        // save material uplifts
        this.bulkSaveMaterialUplifts(this.materialUplifts.materialUplifts);
      }
    })
  }


}
