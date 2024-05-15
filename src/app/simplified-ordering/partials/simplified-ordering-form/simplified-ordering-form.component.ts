import { Quote } from '@angular/compiler';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { ContainerSizeType } from 'src/app/container/models/container-size-type.model';
import { ContainerType } from 'src/app/container/models/container-type.model';
import { Grade } from 'src/app/container/models/grade.model';
import { ContainerService } from 'src/app/container/services/container.service';
import { Contract } from 'src/app/contract/models/contract.model';
import { ContractService } from 'src/app/contract/service/contract.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Account } from 'src/app/order/models/account.model';
import { MaterialUplift } from 'src/app/order/models/material-uplift.model';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { OrderStatusHistory } from 'src/app/order/models/order-status-history.model';
import { OrderType } from 'src/app/order/models/order-type.model';
import { Order } from 'src/app/order/models/order.model';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { ShredderOrderType } from 'src/app/order/models/shredder-order-type.model';
import { ShreddingMethod } from 'src/app/order/models/shredding-method.model';
import { SkipOrderType } from 'src/app/order/models/skip-order-type.model';
import { Unit } from 'src/app/order/models/unit.model';
import { OrderStateService } from 'src/app/order/services/order-state.service';
import { OrderService } from 'src/app/order/services/order.service';
import { OrderValidatorService } from 'src/app/order/validators/order-validator.service';
import { environment } from 'src/environments/environment';
import { SimpleOrderValidatorService } from '../../validator/simple-order-validator.service';

declare var $;

@Component({
  selector: 'app-simplified-ordering-form',
  templateUrl: './simplified-ordering-form.component.html',
  styleUrls: ['./simplified-ordering-form.component.scss']
})
export class SimplifiedOrderingFormComponent implements OnInit {


  @Input()
  account: Account;

  @Input()
  site: Account;

  @Input()
  tipSite: Account;

  @Input()
  order: Order = new Order();

  @Input()
  orderLines: any = {};


  @Input()
  sendEmail: any = {sendEmail: false};
  types: OrderType[] = [];
  quotes: Quote[] = [];
  skipOrderTypes: SkipOrderType[] = [];

  quoteLines: QuoteLine[] = [];

  history: OrderStatusHistory[] = [];

  quoteId: number = -1;

  containerSizes: ContainerSizeType[] = [];
  containerTypes: ContainerType[] = [];
  grades: Grade[] = [];
  tips: Account[] = [];
  shredderTypes: ShredderOrderType[] = [];
  shreddingMethods: ShreddingMethod[] = [];

  isRepeat: boolean = false;

  @Input()
  fromTime: string = '';

  @Input()
  toTime: string = '';

  contracts: Contract[] = [];

  timeOption: number = 1;

  @Input()
  priceListType: string = 'pricelist';
  priceListId: number = -1;

  orderOptions:any = [];
  selectedOrderOptions:any = {};

  units: Unit[] = [];

  @Input()
  materialUplifts: any = {materialUplifts: []};

  accounts: Account[] = [];

  newCustomer:boolean = false;
  showCustomerForm: boolean = false;

  newTipSite:boolean = false;
  showTipForm:boolean = false;


  newSite: boolean = false;
  showSiteForm: boolean = false;

  sites: Account[] = [];
  existingOrders: Order[] = [];

  constructor(private orderService: OrderService,
    private containerService: ContainerService,
    private accountService: AccountService,
    private contractService: ContractService,
    private modalService: ModalService,
    private simpleOrderValidatorService: SimpleOrderValidatorService,
    private OrderValidator: OrderValidatorService,
    private orderStateService: OrderStateService) {
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


  ngOnInit(): void {
    this.orderStateService.quoteIdChanged$.subscribe((id) => {
      this.quoteId = id;
      this.loadQuoteLinesForEdit(id);

      this.orderService.getHistoryByOrderId(this.order.id)
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('order history could not be loaded');
        return e;
      }))
      .pipe(take(1))
      .subscribe((history: OrderStatusHistory[]) => {
        this.history = history;

        this.history.forEach((item) => {
          item.createdAt = moment(item.createdAt).format('DD/MM/YYYY hh:mm:ss');
        })
      });
    });




    this.orderStateService.orderLineAdded$.subscribe((orderLine) => {
      this.orderLines.orderLines.push(orderLine);
    });

    this.orderStateService.gradeAdded$.subscribe((grade: Grade) => {
      this.grades.push(grade);
    })

    this.orderStateService.orderLinesChanged$.subscribe((orderLines) => {

      const hasPriceListItem = orderLines.filter(ol => ol.quoteLineId === -1).length > 0;
      this.priceListType = hasPriceListItem ? 'pricelist' : 'quote';


      this.orderLines.orderLines = orderLines;
    });

    this.orderStateService.materialUpliftAdded$.subscribe((materialUplift: MaterialUplift) => {
      this.materialUplifts.materialUplifts.push(materialUplift);
    });

    this.orderService.getAllOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: OrderType[]) => {
      this.types = types;
    });


    this.orderService.getAllSkipOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: SkipOrderType[]) => {
      this.skipOrderTypes = types;
    });


    this.orderService.getAllUnits()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('units could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((units: Unit[]) => {
      this.units = units;
    });



    this.orderService.getAllShredderOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('shredder order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: ShredderOrderType[]) => {
      this.shredderTypes = types;
    });


    // this.orderService.getAllShreddingMethods()
    // .pipe(catchError((e) => {
    //   if(e.status === 403 || e.status === 401) {
    //     return e;
    //   }
    //   alert('shredder methods could not be loaded');
    //   return e;
    // }))this.tips
    // .pipe(take(1))
    // .subscribe((types: ShreddingMethod[]) => {
    //   this.shreddingMethods = types;
    // });

    this.containerService.getAllContainerSizes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('sizes could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((sizes: ContainerSizeType[]) => {
      this.containerSizes = sizes;
    });

    this.containerService.getAllContainerTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load container types')
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: ContainerType[]) => {
      this.containerTypes = types;
    })

    this.containerService.getAllGrades()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load grades')
      return e;
    }))
    .pipe(take(1))
    .subscribe((grades: Grade[]) => {
      this.grades = grades;
      this.grades.unshift({id: -1, name: 'Select a grade', ewcCode: 'N/A'} as any);

    })

    this.accountService.getAllAccounts()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load tips')
      return e;
    }))
    .pipe(take(1))
    .subscribe((tips: Account[]) => {
      this.accounts = tips.filter(t => t.parentId === -1 || t.parentId === null);
      this.accounts.unshift({name: 'Select an account', id:-1} as any);
    })

    this.accountService.getAllSites()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load sites')
      return e;
    }))
    .pipe(take(1))
    .subscribe((sites: Account[]) => {
      this.sites = sites;
      this.sites.unshift({name: 'Select a site', id:-1} as any);
    })


    this.accountService.getAllTips()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load tips')
      return e;
    }))
    .pipe(take(1))
    .subscribe((tips: Account[]) => {
      this.tips = tips;
      this.tips.unshift({name: 'Select a tip', id:-1} as any);
    })

    $(document).ready(() => {
      $('#datepicker').datepicker();
    })

    this.orderOptions = environment.orderOptions;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.site !== undefined) {
      if(changes.site.currentValue.id !== -1) {
        this.orderService.getQuotesBySiteId(+this.site.id)
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('quotes could not be loaded');
          return e;
        }))
        .pipe(take(1))
        .subscribe((quotes: Quote[]) => {
          this.quotes = quotes;
        });
      }
    }
    if(changes.account !== undefined) {
      if(changes.account.currentValue.id !== -1) {
        this.contractService.getAllByAccountId(+this.account.id)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not load contracts');
          return e;
        }))
        .subscribe((contracts: Contract[]) => {
          this.contracts = contracts;
        })
      }
    }
  }

  getTipName() {
    if(environment.invoicing.companyName === 'Yuill & Dodds Ltd') {
      return 'Delivery Site';
    } else {
      return 'Tip Site';
    }
  }
  onQuoteChanged($event): void {
    this.loadQuoteLines(+$event.target.value);

    this.quoteId = +$event.target.value;
  }

  loadQuoteLines(quoteId: number) {

    this.quoteLines = [];
    this.orderLines.orderLines = [];

    if(quoteId === -1) {
      return;
    }

    if(!quoteId) {
      throw new Error('Order form is missing quote id to load quote')
    }
    this.orderService.getQuoteLinesByQuoteId(quoteId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Quote lines could not be loaded for quote in order form');
      return e;
    }))
    .subscribe((data: QuoteLine[]) => {
      this.quoteLines = data;

      this.quoteLines.forEach((line) => {
        const orderLine: OrderLine = new OrderLine();
        orderLine.quoteLine = line;
        orderLine.quoteLineId = line.id;
        orderLine.qty = line.qty;
        orderLine.price = line.newPrice;
        this.orderLines.orderLines.push(orderLine);
      });

    })
  }

  loadQuoteLinesForEdit(quoteId: number) {

    this.quoteLines = [];

    if(quoteId === -1) {
      return;
    }

    if(!quoteId) {
      throw new Error('Order form is missing quote id to load quote')
    }
    this.orderService.getQuoteLinesByQuoteId(quoteId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Quote lines could not be loaded for quote in order form');
      return e;
    }))
    .subscribe((data: QuoteLine[]) => {
      this.quoteLines = data;

      if(this.orderLines.orrderLines !== []){
        this.orderLines.orderLines.forEach((ol:any) => {

          const quoteLine = this.quoteLines.filter(q => q.id === ol.quoteLineId)[0];

          ol.quoteLine = quoteLine;
          ol.quoteLineId = quoteLine.id;
        })

      }

      (this.orderLines);
    })
  }

  getTotalPriceForOrderLine(orderLine: OrderLine): number {
    if(!orderLine) {
      throw new Error('orderline must be provided in order form for total price');
    }

    return orderLine.price * orderLine.qty;
  }

  isTabComplete(tabName: string) {
    const errors = this.simpleOrderValidatorService.getErrors();

    let isValid = true;

    if(errors.length > 0) {
      errors.forEach((field) => {
        if(field.indexOf(tabName) !== -1) {
          isValid = false;
        }
      })
    }

    return isValid;
  }

  addCustomer() {
    this.newCustomer = true;
    this.showCustomerForm = true;
    this.order.account = new Account();
    this.account = new Account();
    this.order.accountId = -1
  }

  addTipSite() {
    this.newTipSite = true;
    this.showTipForm = true;
    this.order.tipSite = new Account();
    this.tipSite = new Account();
    this.order.tipSiteId = -1;
  }

  addSite() {
    this.newSite = true;
    this.showSiteForm = true;
    this.order.site = new Account();
    this.site = new Account();
    this.order.siteId = -1;
  }

  onTimeOptionClicked($event) {
    this.timeOption = $event.target.value;


    if($event.target.value == '1') {
      this.timeOption === 1;
      this.setTimeBasedOnRange();
    } else {
      this.timeOption === 2;
      this.order.time = $event.target.value;
    }
  }

  setTimeBasedOnRange() {
    this.order.time = this.fromTime + " - " + this.toTime;
  }

  foundContactAddress(event){
    this.order.contactAddressLine1 = event.address1;
    this.order.contactAddressLine2 = event.address2;
    this.order.contactAddressLine3 = event.address3;
    this.order.contactCity = event.city;
    this.order.contactCountry = event.country;
  }

  updateOrderDetails(event){
    this.order.orderTypeId = parseInt(event.target.value,10);
    this.order.orderType.id = parseInt(event.target.value,10);

    this.selectedOrderOptions = this.orderOptions.filter(f=>f.orderTypeId === parseInt(event.target.value,10))[0];

  }

  populateTipNotes(account: Account) {

    // if tipping notes add them to order
    if(this.order.description === '') {
      this.order.description = account.notes;
      this.order.driverNotes = account.notes;
    }
  }

  copyPOToSite() {
    this.site.poNumber = this.order.poNumber;
    this.accountService.updateAccount(this.site)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not copy po to site');
      return e;
    }))
    .subscribe(() => {
      alert('PO copied to site');
    })
  }

  openModal(name:string) {
    this.modalService.open(name);
  }

  isTipperEdit() {

    // it's editing an order, it's not skip and it's not pending
    return this.order.id > -1 && this.order.orderTypeId > 1 && this.order.orderStatusId > 1;
  }

  getAnyTimeOption() {
    let option = 'ASAP';

    if(environment.invoicing.companyName === 'Total Recycling Scotland') {
      option = 'Any time';
    }

    return option;
  }


  transferAddress(){
    if(
      this.order.account.shippingAddress1 !== '' ||
      this.order.account.shippingAddress2 !== '' ||
      this.order.account.shippingCity !== '' ||
      this.order.account.shippingCountry !== '' ||
      this.order.account.shippingPostCode !== ''
    ) {
      if(confirm('Overwrite Existing Shipping Details?')){
        this.confirmTransfer();
      }
    } else {
      this.confirmTransfer();
    }
  }

  confirmTransfer(){
    this.order.account.shippingAddress1 = this.order.account.billingAddress1;
    this.order.account.shippingAddress2 = this.order.account.billingAddress2;
    this.order.account.shippingCity = this.order.account.billingCity;
    this.order.account.shippingCountry = this.order.account.billingCountry;
    this.order.account.shippingPostCode = this.order.account.billingPostCode;
  }


  transferSiteAddress(){
    if(
      this.order.site.shippingAddress1 !== '' ||
      this.order.site.shippingAddress2 !== '' ||
      this.order.site.shippingCity !== '' ||
      this.order.site.shippingCountry !== '' ||
      this.order.site.shippingPostCode !== ''
    ) {
      if(confirm('Overwrite Existing Shipping Details?')){
        this.confirmSiteTransfer();
      }
    } else {
      this.confirmSiteTransfer();
    }
  }

  confirmSiteTransfer(){
    this.order.site.shippingAddress1 = this.order.site.billingAddress1;
    this.order.site.shippingAddress2 = this.order.site.billingAddress2;
    this.order.site.shippingCity = this.order.site.billingCity;
    this.order.site.shippingCountry = this.order.site.billingCountry;
    this.order.site.shippingPostCode = this.order.site.billingPostCode;
  }


  transferTipAddress(){
    if(
      this.order.tipSite.shippingAddress1 !== '' ||
      this.order.tipSite.shippingAddress2 !== '' ||
      this.order.tipSite.shippingCity !== '' ||
      this.order.tipSite.shippingCountry !== '' ||
      this.order.tipSite.shippingPostCode !== ''
    ) {
      if(confirm('Overwrite Existing Shipping Details?')){
        this.confirmTipTransfer();
      }
    } else {
      this.confirmTipTransfer();
    }
  }

  confirmTipTransfer(){
    this.order.tipSite.shippingAddress1 = this.order.tipSite.billingAddress1;
    this.order.tipSite.shippingAddress2 = this.order.tipSite.billingAddress2;
    this.order.tipSite.shippingCity = this.order.tipSite.billingCity;
    this.order.tipSite.shippingCountry = this.order.tipSite.billingCountry;
    this.order.tipSite.shippingPostCode = this.order.tipSite.billingPostCode;
  }

  foundBillingAddress(event){
    this.order.account.billingAddress1 = event.address1;
    this.order.account.billingAddress2 = event.address2;
    this.order.account.billingCity = event.city;
    this.order.account.billingCountry = event.country;
  }

  foundShippingAddress(event){
    this.order.account.shippingAddress1 = event.address1;
    this.order.account.shippingAddress2 = event.address2;
    this.order.account.shippingCity = event.city;
    this.order.account.shippingCountry = event.country;
  }


  foundSiteBillingAddress(event){
    this.order.site.billingAddress1 = event.address1;
    this.order.site.billingAddress2 = event.address2;
    this.order.site.billingCity = event.city;
    this.order.site.billingCountry = event.country;
  }

  foundSiteShippingAddress(event){
    this.order.site.shippingAddress1 = event.address1;
    this.order.site.shippingAddress2 = event.address2;
    this.order.site.shippingCity = event.city;
    this.order.site.shippingCountry = event.country;
  }

  foundTipBillingAddress(event){
    this.order.tipSite.billingAddress1 = event.address1;
    this.order.tipSite.billingAddress2 = event.address2;
    this.order.tipSite.billingCity = event.city;
    this.order.tipSite.billingCountry = event.country;
  }

  foundTipShippingAddress(event){
    this.order.tipSite.shippingAddress1 = event.address1;
    this.order.tipSite.shippingAddress2 = event.address2;
    this.order.tipSite.shippingCity = event.city;
    this.order.tipSite.shippingCountry = event.country;
  }

  loadAccount() {
    this.order.account = this.accounts.filter(a => a.id === this.order.accountId)[0];

    console.log(this.order.accountId);
    this.account.id = this.order.accountId;

    this.loadSitesForAccount();
  }

  loadTipSite() {
    this.order.tipSite = this.tips.filter(t => t.id === this.order.tipSiteId)[0];
    this.tipSite.id = this.order.tipSite.id;
  }

  loadSite() {
    this.order.site = this.sites.filter(s => s.id === this.order.siteId)[0];
    this.site.id = this.order.siteId;

    //do duplicate lookup check
    if(this.order.account.id != -1 && this.order.site.id !== -1) {
      this.loadExistingOrders();
    }
  }

  loadSitesForAccount() {
    this.accountService.getAllAccounts()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load sites');
      return e;
    }))
    .subscribe((sites: any) => {
      this.sites = sites.filter(s => s.parentId === this.order.account.id || (s.parentId === -1 && s.type_id === 13 ));
    })
  }

}
