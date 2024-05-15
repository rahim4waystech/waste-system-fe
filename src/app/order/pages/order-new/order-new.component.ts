import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/account.model';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { catchError, take } from 'rxjs/operators';
import { Order } from '../../models/order.model';
import { OrderValidatorService } from '../../validators/order-validator.service';
import { OrderLine } from '../../models/order-line.model';

import * as moment from 'moment';
import { CreditLimit } from 'src/app/account/models/credit-limit.model';
import { AccountService } from 'src/app/account/services/account.service';
import { environment } from 'src/environments/environment';
import { MaterialUplift } from '../../models/material-uplift.model';

declare var $;
@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss']
})
export class OrderNewComponent implements OnInit {

  account: Account = new Account();
  site: Account = new Account();

  order: Order = new Order();

  isError = false;
  isServerError = false;

  repeatDates: string[] = [];

  creditLimit: CreditLimit = new CreditLimit();

  warningForCreditLimit = false;
  existingOrders: Order[] = [];


  orderLines: any = {orderLines: []};
  materialUplifts: any = {materialUplifts: []};
  constructor(private route: ActivatedRoute,
              private orderValidator: OrderValidatorService,
              private accountService: AccountService,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadAccount(+params.accountId);
      this.loadSite(+params.siteId);
    });
  }

  loadAccount(accountId: number) {
    this.orderService.getAccountById(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if (e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load account');
      return e;
    }))
    .subscribe((account: Account) => {
      this.account = account;
      this.order.account.id = account.id;
      this.order.accountId = this.order.account.id;


      if (this.account.limitEnabled) {
        this.loadCreditLimit();
      }
    });
  }

  loadCreditLimit() {
    this.accountService.getCreditLimit(this.account.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      return e;
    }))
    .subscribe((creditLimit: CreditLimit) => {

      this.creditLimit = creditLimit[0];

      const load = (this.creditLimit.usedCredit) / this.creditLimit.maxCredit;


      // 20 % credit limit check
      if (load >= 0.8) {
        this.warningForCreditLimit = true;
      }
    });
  }

  loadSite(accountId: number) {
    this.orderService.getAccountById(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if (e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load site');
      return e;
    }))
    .subscribe((account: Account) => {
      this.site = account;
      this.order.siteId = account.id;
      this.order.site.id = account.id;


      if (this.site.poNumber && this.site.poNumber !== '') {
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

      // load existing orders.
      this.loadExistingOrders();
  }

  loadExistingOrders() {
    this.orderService.getActiveOrdersByAccountAndSite(this.order.accountId, this.order.siteId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if (e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load existing');
      return e;
    }))
    .subscribe((orders: Order[]) => {
      this.existingOrders = orders;
    });
  }

  onSubmit() {
    if (this.order.orderTypeId === 8 && this.order.shredderOrderTypeId === 3){
      const deliveryOrder = JSON.parse(JSON.stringify(this.order));
      const returnOrder = JSON.parse(JSON.stringify(this.order));

      deliveryOrder.description = 'Delivering ' + deliveryOrder.description;
      deliveryOrder.isPrepaid = false;
      returnOrder.description = 'Collecting ' + returnOrder.description;
      returnOrder.isPrepaid = true;

      const deliveryLines = JSON.parse(JSON.stringify(this.orderLines));
      const returnLines = JSON.parse(JSON.stringify(this.orderLines));

      deliveryLines.orderLines.forEach(line => {
        line.quoteLine.qty = 1;
        line.qty = 1;
      });

      returnLines.orderLines.forEach(line => {
        line.quoteLine.newPrice = 0;
        line.price = 0;
      });

      this.save(deliveryOrder, deliveryLines);
      this.save(returnOrder, this.orderLines);
    } else {
      this.save(this.order, this.orderLines);
    }
  }

  save(incomingOrder, incomingOrderLines){
    this.isError = false;
    this.isServerError = false;

    // const dates = $('#datepicker').data('datepicker').selectedDates;

    // const formattedDates = [];

    // dates.forEach((date) => {
    //   formattedDates.push(moment(date).format('YYYY-MM-DD'))
    // })

    this.repeatDates = [];
    const dates = [];



    if (this.orderValidator.isDataValid(incomingOrder, this.orderLines)) {

      const orderlinesSave = incomingOrderLines.orderLines.filter(o => o.qty > 0 || o.isPrimaryCharge);

      // Check for limits
      if (this.account.limitEnabled) {

        let total = 0;
        orderlinesSave.forEach((orderLine: OrderLine) => {
          total += orderLine.price * orderLine.qty;
        });

        if (total + this.creditLimit.usedCredit > this.creditLimit.maxCredit) {
          alert('Credit limit exceeded for account. This order cannot go forward');
          return;
        }


      }

      // try to save it
      incomingOrder.orderStatusId = 1;
      incomingOrder.orderStatus.id = 1;

      // if  box auto accept
      if (environment.invoicing.companyName === 'Yuill & Dodds Ltd') {
        incomingOrder.orderStatusId = 2;
        incomingOrder.orderStatus.id = 2;
      }

      this.orderService.createOrder(incomingOrder)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((order: Order) => {

        // get orderlines supplied
        const orderlinesSave = incomingOrderLines.orderLines.filter(o => o.qty > 0 || o.isPrimaryCharge);

        let total = 0;

        this.materialUplifts.materialUplifts.forEach((uplift: any) => {
          uplift.orderId = order.id;
        });

        orderlinesSave.forEach((orderLine: OrderLine) => {
          orderLine.order.id = order.id;
          orderLine.orderId = order.id;

          total += orderLine.price * orderLine.qty;
        });

        this.bulkSaveOrderLines(orderlinesSave);
      });
    } else {
      this.isError = true;
    }
  }

  bulkSaveOrderLines(orderLines: OrderLine[]) {
    if (!orderLines) {
      this.isServerError = true;
    }

    this.orderService.createBulkOrderLines(orderLines)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {
      // assume all good redirect

      if (this.repeatDates.length > 0) {
        this.copyToDates(orderLines[0].orderId, this.repeatDates.join(','));
      } else {

      if (this.materialUplifts.materialUplifts.length === 0) {
        window.location.href = '/orders';
      } else {
        // save material uplifts
        this.bulkSaveMaterialUplifts(this.materialUplifts.materialUplifts);
      }
      }
    });
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
    });
  }

  copyToDates(orderId: number, repeatDates: string) {
    this.orderService.copyOrderToDates(orderId, repeatDates)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if (e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not copy order to dates');
      return e;
    }))
    .subscribe(() => {
      if (this.materialUplifts.materialUplifts.length === 0) {
        window.location.href = '/orders';
      } else {
        // save material uplifts
        this.bulkSaveMaterialUplifts(this.materialUplifts.materialUplifts);
      }
    });
  }

}
