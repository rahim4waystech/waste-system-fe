import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { take, catchError } from 'rxjs/operators';
import { Account } from '../../models/account.model';
import { QuoteService } from 'src/app/quoting/services/quote.service';
import { Quote } from '../../models/quote.model';
import * as moment from 'moment';
import { QuoteLine } from '../../models/quote-line-model';
import { OrderLine } from '../../models/order-line.model';
import { OrderValidatorService } from '../../validators/order-validator.service';
import { AccountService } from 'src/app/account/services/account.service';

@Component({
  selector: 'app-order-quick',
  templateUrl: './order-quick.component.html',
  styleUrls: ['./order-quick.component.scss']
})
export class OrderQuickComponent implements OnInit {

  isServerError: boolean = false;
  isError: boolean = false;
  order: Order = new Order();

  account: Account = new Account();
  site: Account = new Account();


  quoteLines : any = {quoteLines: [] as QuoteLine[]};
  constructor(private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private orderValidatorService: OrderValidatorService,
    private quoteService: QuoteService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadAccount(+params['accountId']);
      this.loadSite(+params['siteId']);
    })
  }

  loadAccount(accountId: number) {
    this.orderService.getAccountById(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load account');
      return e;
    }))
    .subscribe((account: Account) => {
      this.account = account;
      this.order.account.id = account.id;
      this.order.accountId = this.order.account.id;
    });
  }

  loadSite(accountId: number) {
    this.orderService.getAccountById(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load site');
      return e;
    }))
    .subscribe((account: Account) => {
      this.site = account;
      this.order.siteId = account.id;
      this.order.site.id = account.id;

      if(this.site.poNumber && this.site.poNumber !== '') {
        this.order.poNumber = this.site.poNumber;
      }

      this.setCoreContactDetails();
    });
  }


  setCoreContactDetails(): void {
    // set contact details
    this.order.contactAddressLine1 = this.site.billingAddress1;
    this.order.contactAddressLine2 = this.site.billingAddress2;
    this.order.contactCity = this.site.billingCity;
    this.order.contactCountry = this.site.billingCountry;
    this.order.contactTelephone = this.site.phoneNumber;
    this.order.contactName = this.site.contact;
}


save() {
  this.isServerError = false;
  this.isError = false;

  // proxy items
  const orderLines = {orderLines: this.quoteLines.quoteLines};

  if(!this.orderValidatorService.isDataValid(this.order, orderLines)) {
    this.isError = true;
    return;
  }


  this.createQuote();
}

createQuote() {
  const quote = new Quote();
  quote.accountId = this.site.id;
  quote.account.id = this.site.id;
  quote.quoteStatus = {id:2};
  quote.statusId = 2; //auto accept
  quote.statusId = 2;
  quote.validFrom = moment().format('YYYY-MM-DD');
  quote.validTo = moment().add(1, 'year').format('YYYY-MM-DD');
  quote.quoteNumber = 'autogenerated';
  quote.name = "Quick order -" + moment().format('YYYY-MM-DD');

  this.quoteService.createQuote(quote)
  .pipe(take(1))
  .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
    alert("could not create a quote");
    return e;
  }))
  .subscribe((quote: Quote) => {
    this.saveQuoteLines(quote);
  })

}

saveQuoteLines(quote: Quote) {
  this.quoteLines.quoteLines.forEach((line: QuoteLine) => {
    line.quoteId = quote.id;
  });

  this.quoteService.createBulkQuoteLines(this.quoteLines.quoteLines)
  .pipe(take(1))
  .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
    alert('Could not create quote lines');
    return e;
  }))
  .subscribe((lines: QuoteLine[]) => {
    this.createOrder(lines);
  })
}

createOrder(lines: QuoteLine[]) {
  this.order.orderStatusId = 1;
  this.order.orderStatus.id = 1;

  if(this.order.orderTypeId === 8 && this.order.shredderOrderTypeId === 3){
    let deliveryOrder = JSON.parse(JSON.stringify(this.order));
    let returnOrder = JSON.parse(JSON.stringify(this.order));

    deliveryOrder.description = 'Delivering ' + deliveryOrder.description;
    deliveryOrder.isPrepaid = false;
    returnOrder.description = 'Collecting ' + returnOrder.description;
    returnOrder.isPrepaid = true;

    let deliveryLines = JSON.parse(JSON.stringify(lines));
    let returnLines = JSON.parse(JSON.stringify(lines));

    this.orderService.createOrder(deliveryOrder)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((order: Order) => {
      const deliveryOrderLines: OrderLine[] = [];

      deliveryLines.forEach((line: QuoteLine) => {
        const orderLine = new OrderLine();
        orderLine.order.id = order.id;
        orderLine.orderId = order.id;
        orderLine.qty = 1;
        orderLine.price = line.newPrice;
        orderLine.isPrimaryCharge = false;
        orderLine.quoteLineId = line.id;
        orderLine.quoteLine.id = line.id;

        deliveryOrderLines.push(orderLine);
      })

      this.orderService.createBulkOrderLines(deliveryOrderLines)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data) => {

        this.orderService.createOrder(returnOrder)
        .pipe(take(1))
        .pipe(catchError((e) => {
          this.isServerError = true;
          return e;
        }))
        .subscribe((order: Order) => {
          const returnOrderLines: OrderLine[] = [];
          returnLines.forEach((line: QuoteLine) => {
            const orderLine = new OrderLine();
            orderLine.order.id = order.id;
            orderLine.orderId = order.id;
            orderLine.qty = line.qty;
            orderLine.price = 0;
            orderLine.isPrimaryCharge = false;
            orderLine.quoteLineId = line.id;
            orderLine.quoteLine.id = line.id;

            returnOrderLines.push(orderLine);
          })

          this.orderService.createBulkOrderLines(returnOrderLines)
          .pipe(take(1))
          .pipe(catchError((e) => {
            this.isServerError = true;
            return e;
          }))
          .subscribe((data) => {
            this.router.navigateByUrl('/orders');
          })
        })

      })
    })



  } else {
    this.orderService.createOrder(this.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((order: Order) => {
      this.createOrderLines(order, lines);
    })
  }
}

createOrderLines(order: Order, lines: QuoteLine[]) {
  const orderLines: OrderLine[] = [];

  lines.forEach((line: QuoteLine) => {
    const orderLine = new OrderLine();
    orderLine.order.id = order.id;
    orderLine.orderId = order.id;
    orderLine.qty = line.qty;
    orderLine.price = line.newPrice;
    orderLine.isPrimaryCharge = false;
    orderLine.quoteLineId = line.id;
    orderLine.quoteLine.id = line.id;

    orderLines.push(orderLine);
  })

  this.orderService.createBulkOrderLines(orderLines)
  .pipe(take(1))
  .pipe(catchError((e) => {
    this.isServerError = true;
    return e;
  }))
  .subscribe((data) => {
    this.router.navigateByUrl('/orders');
  })
}

}