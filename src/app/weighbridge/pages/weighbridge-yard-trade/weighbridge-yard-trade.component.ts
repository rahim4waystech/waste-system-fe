import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/order/models/account.model';
import { AccountService } from 'src/app/account/services/account.service';
import { take, catchError } from 'rxjs/operators';
import { YardTrade } from '../../models/yard-trade.model';
import { YardTradePricing } from '../../models/yard-trade-pricing.model';
import { QuoteService } from 'src/app/quoting/services/quote.service';
import { Quote } from 'src/app/order/models/quote.model';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { OrderService } from 'src/app/order/services/order.service';
import { YardTradeValidatorService } from '../../validators/yardtrade-validator.service';
import { YardTradeService } from '../../services/yard-trade.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { YardtradeStateService } from '../../services/yardtrade-state.service';
import { Unit } from 'src/app/order/models/unit.model';
import { Grade } from 'src/app/container/models/grade.model';
import { ContainerService } from 'src/app/container/services/container.service';

@Component({
  selector: 'app-weighbridge-yard-trade',
  templateUrl: './weighbridge-yard-trade.component.html',
  styleUrls: ['./weighbridge-yard-trade.component.scss']
})
export class WeighbridgeYardTradeComponent implements OnInit {

  customer: Account = new Account();
  depots: Account[] = [];
  yardTrade: YardTrade = new YardTrade();
  yardTradePricing: YardTradePricing[] = [];
  quotes: Quote[] = [];
  quoteId: number = -1;
  quoteLines: QuoteLine[] = [];
  units: Unit[] = [];
  grades: Grade[] = [];

  isError: boolean = false;
  isSuccess: boolean = false;
  isServerError: boolean = false;

  constructor(private route: ActivatedRoute,
    private yardTradeService: YardTradeService,
    private router: Router,
    private quoteService: QuoteService,
    private containerService: ContainerService,
    private yardTradeValidatorService: YardTradeValidatorService,
    private yardTradeStateService: YardtradeStateService,
    private orderService: OrderService,
    private modalService: ModalService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadAccount(+params['id']);
    })

    this.accountService.getAllDepots()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load depots');
      return e;
    }))
    .subscribe((data: Account[]) => {
      this.depots = data;
    })

    this.containerService.getAllGrades()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load grades');
      return e;
    }))
    .subscribe((grades: any) => {
      this.grades = grades;
    })

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load units');
      return e;
    }))
    .subscribe((data: Unit[]) => {
      this.units = data;
    })


    this.yardTradeStateService.$ItemAdded
    .subscribe((item) => {
      this.yardTradePricing.push(item);
    })

    this.yardTradeService.count()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get total count for yard trade')
      return e;
    }))
    .subscribe((data: any) => {
      if(this.yardTrade.ticketNumber === ''){
        this.yardTrade.ticketNumber = data.length + 1;
      }
    })
  }

  loadSites() {
    this.accountService.getAllSitesForAccount(this.customer.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('site could not be loaded')
      return e;
    }))
    .subscribe((sites: Account[]) => {
      const ids = sites.map(s => s.id);

      this.loadQuotes(ids);
    })
  }

  loadQuotes(siteIds: number[]) {
    this.quoteService.getQuotesBySites(siteIds)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      // alert('could not load quotes');
      return e;
    }))
    .subscribe((quotes: Quote[]) => {
      this.quotes = quotes;
    })
  }

  loadAccount(id: number) {
    if(!id || id === -1) {
      alert('Please supply id to load account');
      return;
    }


    this.accountService.getAccountById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      return e;
    }))
    .subscribe((data: Account) => {
      this.customer = data;
      this.yardTrade.customer.id = data.id;
      this.yardTrade.customerId = data.id;
      this.loadSites();
    })

  }


  onQuoteChanged($event): void {
   this.loadQuoteLines(+$event.target.value);

    this.quoteId = +$event.target.value;
  }

  getTotalPrice(yardTradePrice: YardTradePricing): number {
    if(!yardTradePrice) {
      throw new Error('yard trade price must be provided in order form for total price');
    }

    return yardTradePrice.price * yardTradePrice.qty;
  }



  loadQuoteLines(quoteId: number) {

    this.quoteLines = [];
    this.yardTradePricing = [];

    if(quoteId === -1) {
      return;
    }

    if(!quoteId) {
      throw new Error('form is missing quote id to load quote')
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
        const price: YardTradePricing = new YardTradePricing();
        price.quoteLine = line;
        price.quoteLineId = line.id;
        price.qty = 0;
        price.price = line.newPrice;
        this.yardTradePricing.push(price);
      });

    })
  }

  save() {
    this.isError = false;
    this.isServerError = false;
    this.isSuccess = false;

    if(!this.yardTradeValidatorService.isDataValid(this.yardTrade, this.yardTradePricing)) {
      this.isError = true;
      return;
    }

    this.yardTradeService.createYardTrade(this.yardTrade)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError  = true;
      return e;
    }))
    .subscribe((data: YardTrade) => {

      this.yardTradePricing.forEach((price: YardTradePricing) => {
        price.id = -1;
        price.yardTrade.id = data.id;
        price.yardTradeId = data.id;
      })
      this.bulkSavePricing(this.yardTradePricing);
    })


  }


  bulkSavePricing(pricing: YardTradePricing[]) {
    if(!pricing) {
      this.isServerError = true;
    }

    this.yardTradeService.createBulkPricing(this.yardTradePricing)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {

      window.location.href = '/weighbridge/yard-trade/list';
    })
  }

  openModal(modal:string) {
    this.modalService.open(modal);
  }

  getUnitFromUnitId(unitId:number) {
    return this.units.filter(u => u.id === unitId)[0];
  }




}
