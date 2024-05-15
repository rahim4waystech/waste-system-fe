import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { take, catchError, defaultIfEmpty, map } from 'rxjs/operators';
import { CreditLimit } from 'src/app/account/models/credit-limit.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { MaterialUplift } from 'src/app/order/models/material-uplift.model';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { Order } from 'src/app/order/models/order.model';
import { OrderService } from 'src/app/order/services/order.service';
import { OrderValidatorService } from 'src/app/order/validators/order-validator.service';
import { environment } from 'src/environments/environment';
import { SimpleOrderValidatorService } from '../../validator/simple-order-validator.service';

@Component({
  selector: 'app-simplified-ordering-new',
  templateUrl: './simplified-ordering-new.component.html',
  styleUrls: ['./simplified-ordering-new.component.scss']
})
export class SimplifiedOrderingNewComponent implements OnInit {
  account: Account = new Account();
  site: Account = new Account();

  order: Order = new Order();

  tipSite: Account = new Account();

  isError = false;
  isServerError = false;

  repeatDates: string[] = [];

  creditLimit: CreditLimit = new CreditLimit();

  warningForCreditLimit = false;


  orderLines: any = {orderLines: []};
  materialUplifts: any = {materialUplifts: []};
  constructor(private route: ActivatedRoute,
              private simpleOrderValidatorService: SimpleOrderValidatorService,
              private orderValidator: OrderValidatorService,
              private accountService: AccountService,
              private orderService: OrderService) { }

  ngOnInit(): void {

    // this.order.account = new Account();
    // this.order.site = new Account();
    // this.order.tipSite = new Account();


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



    if (this.simpleOrderValidatorService.isDataValid(incomingOrder, this.orderLines, this.account, this.site, this.tipSite)) {

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
      //if (environment.invoicing.companyName === 'Yuill & Dodds Ltd') {
        incomingOrder.orderStatusId = 2;
        incomingOrder.orderStatus.id = 2;
      //}


      // saves account, site and tip site
      this.saveCoreElements().subscribe((data: any) => {

        console.log('save complete');
        data.forEach((element: any) => {
          if(element.type === 'account') {
            this.order.accountId = element.data.id;
            this.order.account = element.data;
          }

          if(element.type === 'site') {
            this.order.site = element.data;
            this.order.siteId = element.data.id;
          }

          if(element.type === 'tipSite') {
            this.order.tipSite = element.data;
            this.order.tipSiteId = element.data.id;
          }
        });

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
      })


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

  saveCoreElements() {
    let elements: any = [];
    if(this.account.id === -1) {


      elements.push(this.saveAccount());
    }

    if(this.site.id === -1) {
      elements.push(this.saveSite());
    }

    if(this.order.tipSiteId === -1) {
      elements.push(this.saveTipSite());
    }

    return forkJoin(elements).pipe(
      defaultIfEmpty([]),
    )

  }

  saveAccount() {

    this.order.account.type_id = 3;
    this.order.account.type = {id: 3} as any;
    this.order.account.shippingAddress1 = this.order.account.billingAddress1;
    this.order.account.shippingAddress2 = this.order.account.billingAddress2;
    this.order.account.shippingCity = this.order.account.billingCity;
    this.order.account.shippingCountry = this.order.account.billingCountry;
    this.order.account.shippingPostCode = this.order.account.billingPostCode;

    return this.accountService.createAccount(this.order.account)
    .pipe(take(1))
    .pipe(catchError((e) =>{
      alert('could not save account');
      return e;
    }))
    .pipe(
      defaultIfEmpty([]),
    )
    .pipe(map((data => {
        return {data: data, type: 'account'}
    })));
  }

  saveTipSite() {
    this.order.tipSite.type_id = 15;
    this.order.tipSite.type = {id: 15} as any;

    this.order.tipSite.shippingAddress1 = this.order.tipSite.billingAddress1;
    this.order.tipSite.shippingAddress2 = this.order.tipSite.billingAddress2;
    this.order.tipSite.shippingCity = this.order.tipSite.billingCity;
    this.order.tipSite.shippingCountry = this.order.tipSite.billingCountry;
    this.order.tipSite.shippingPostCode = this.order.tipSite.billingPostCode;

    return this.accountService.createAccount(this.order.tipSite)
    .pipe(take(1))
    .pipe(catchError((e) =>{
      alert('could not save tip site');
      return e;
    }))
    .pipe(
      defaultIfEmpty([]),
    )
    .pipe(map((data => {
      return {data: data, type: 'tipSite'}
  })));
  }


  saveSite() {
    this.order.account.type_id = 13;
    this.order.account.type = {id: 13} as any;

    this.order.site.shippingAddress1 = this.order.site.billingAddress1;
    this.order.site.shippingAddress2 = this.order.site.billingAddress2;
    this.order.site.shippingCity = this.order.site.billingCity;
    this.order.site.shippingCountry = this.order.site.billingCountry;
    this.order.site.shippingPostCode = this.order.site.billingPostCode;

    return this.accountService.createAccount(this.order.site)
    .pipe(take(1))
    .pipe(catchError((e) =>{
      alert('could not save account');
      return e;
    }))
    .pipe(
      defaultIfEmpty([]),
    )
    .pipe(map((data => {
      return {data: data, type: 'site'}
  })));
  }


}
