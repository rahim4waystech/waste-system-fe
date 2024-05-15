import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { OrderType } from '../../models/order-type.model';
import { OrderService } from '../../services/order.service';
import { catchError, take } from 'rxjs/operators';
import { Order } from '../../models/order.model';
import { Quote } from '../../models/quote.model';
import { QuoteLine } from '../../models/quote-line-model';
import { OrderLine } from '../../models/order-line.model';
import { OrderStateService } from '../../services/order-state.service';
import { SkipOrderType } from '../../models/skip-order-type.model';
import { OrderValidatorService } from '../../validators/order-validator.service';
import { OrderStatusHistory } from '../../models/order-status-history.model';
import * as moment from 'moment';
import { ContainerService } from 'src/app/container/services/container.service';
import { ContainerSizeType } from 'src/app/container/models/container-size-type.model';
import { ContainerType } from 'src/app/container/models/container-type.model';
import { Grade } from 'src/app/container/models/grade.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { environment } from 'src/environments/environment';
import { Contract } from 'src/app/contract/models/contract.model';
import { ContractService } from 'src/app/contract/service/contract.service';
import { ShredderOrderType } from '../../models/shredder-order-type.model';
import { ShreddingMethod } from '../../models/shredding-method.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { Unit } from '../../models/unit.model';
import { MaterialUplift } from '../../models/material-uplift.model';
declare var $;

@Component({
  selector: 'app-order-simple-form',
  templateUrl: './order-simple-form.component.html',
  styleUrls: ['./order-simple-form.component.scss']
})
export class OrderSimpleFormComponent implements OnInit, OnChanges {
  @Input()
  account: Account;

  @Input()
  site: Account;

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
  priceListType: string = 'quote';
  priceListId: number = -1;

  orderOptions:any = [];
  selectedOrderOptions:any = {};

  units: Unit[] = [];

  @Input()
  materialUplifts: any = {materialUplifts: []};

  accounts: Account[] = [];
  accountList: Account[];
  sitesList: Account[];

  constructor(private orderService: OrderService,
              private containerService: ContainerService,
              private accountService: AccountService,
              private contractService: ContractService,
              private modalService: ModalService,
              private OrderValidator: OrderValidatorService,
              private orderStateService: OrderStateService) {
  }

  ngOnInit(): void {
    this.updateAccountList();
    this.updateSiteList(this.order.accountId);

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

    this.orderStateService.companyAdded$.subscribe((newAccount: Account) => {

      this.changeAccount(newAccount.id);
      this.updateAccountList();
      this.account = newAccount;
      this.order.accountId = this.account.id;
      this.order.account.id = newAccount.id;
      this.order.siteId = -1;
      this.updateSiteList(this.order.accountId);
    });


    this.orderStateService.siteAdded$.subscribe((account: Account) => {
      this.updateSiteList(this.account.id);
      this.site = account;
      this.order.siteId = account.id;
    });

    this.orderStateService.siteAndCompanyAdded$.subscribe((account: Account) => {
      this.changeAccount(account.id);
      this.updateAccountList();
      this.account = account;
      this.order.accountId = this.account.id;
      this.order.account.id = account.id;
      this.updateSiteList(this.order.accountId);
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
        this.accounts = tips;
        this.accounts.unshift({name: 'Select an account', id:-1} as any);
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

  ngOnChanges(changes: any){

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
    const errors = this.OrderValidator.getErrors();

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

  updateAccountList(){
    this.accountService.getAllCustomers()
      .pipe(catchError((e) => {
        if (e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Accounts/Customers could not be loaded');
        return e;
      }))
      .pipe(take(1))
      .subscribe((accounts: Account[]) => {
        this.accountList = accounts;

      });
  }

  updateSiteList(accountId: number){
    if (!isNaN(accountId)) {
      this.sitesList = [];
      if (accountId !== -1) {
        this.accountService.getAllSitesForAccount(accountId)
          .pipe(catchError((e) => {
            if (e.status === 403 || e.status === 401) {
              return e;
            }
            return e;
          }))
          .pipe(take(1))
          .subscribe((sites: Account[]) => {
            this.sitesList = sites;
          });
      }
    } else {
      this.order.siteId = -1;
    }
  }


  changeAccount(accountID: number) {
    if (!isNaN(accountID)) {
      this.accountService.getAccountById(accountID)
        .pipe(catchError((e) => {
          if (e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Accounts/Customers could not be loaded ');
          return e;
        }))
        .pipe(take(1))
        .subscribe((account: Account) => {
          this.account = account;
        });
    } else {
      this.order.accountId = -1;
    }
  }

  updateTips(){

    this.accountService.getAllTips()
      .pipe(catchError((e) => {
        if (e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not load tips')
        return e;
      }))
      .pipe(take(1))
      .subscribe((tips: Account[]) => {
        this.tips = tips;
        this.tips.unshift({name: 'Select a tip', id:-1} as any);
      });
  }


}
