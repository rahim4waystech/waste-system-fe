import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Quote } from 'src/app/order/models/quote.model';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { Account } from 'src/app/order/models/account.model';
import { Product } from 'src/app/order/models/product.model';
import { ProductService } from '../../services/product.service';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { QuoteStateService } from '../../services/quote-state.service';
import { QuoteService } from '../../services/quote.service';
import { environment } from 'src/environments/environment';
import { QuoteStatusHistory } from '../../models/quote-status-history.model';
import * as moment from 'moment';

@Component({
  selector: 'app-quote-forms',
  templateUrl: './quote-forms.component.html',
  styleUrls: ['./quote-forms.component.scss']
})
export class QuoteFormsComponent implements OnInit,OnChanges {

  @Input()
  account: Account = new Account();

  @Input()
  site: Account = new Account();

  @Input()
  quote: Quote;

  @Input()
  quoteLines: any = {quoteLines: []};

  products: Product[] = [];

  history: QuoteStatusHistory[] = [];

  constructor(private productService: ProductService,
    private quoteService: QuoteService,
    private quoteStateService: QuoteStateService,
    private modalService: ModalService) { }

  ngOnInit(): void {

    if(environment.defaults.companyName === 'WRC') {
      const prefix = 'Quote-' + moment().format('MM') + '-' + moment().format('yyyy') + '-';

      this.quoteService.countByMonthAndYear(moment().format('MM'), moment().format('yyyy'))
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('could not get total count for month and year for quote');
        return e;
      }))
      .subscribe((data:any) => {
        if(this.quote.quoteNumber === ''){
          this.quote.quoteNumber = prefix + (data.length + 1);
        }
      })
      // make call to check count
    } else {
      this.quoteService.count()
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not get total count for quotes')
        return e;
      }))
      .subscribe((data: any) => {
        if(this.quote.quoteNumber === ''){
          this.quote.quoteNumber = environment.defaults.quoteNoPrefix + (data.length + 1);
        }
      })
    }
    this.productService.getAllActiveProducts()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load products');
      return e;
    }))
    .subscribe((data: Product[]) => {
      this.products = data;
    });

    this.quoteStateService.$newQuoteLineAdded
    .subscribe((quoteLine: QuoteLine) => {
      this.quoteLines.quoteLines.push(quoteLine);
    })
  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.quote) {
      if(simple.quote.currentValue.id > 0) {
        this.quoteService.getQuoteStatusHistoryForQuoteId(this.quote.id)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('could not load history');
          return e;
        }))
        .subscribe((history: QuoteStatusHistory[]) => {
          this.history = history;
        })
      }
    }
  }

  openModal(name: string) {
    this.modalService.open(name);
  }

  getTotalPriceForQuoteLine(quoteLine: QuoteLine): number {
    if(!quoteLine) {
      throw new Error('quoteline must be provided in order form for total price');
    }

    return quoteLine.newPrice * quoteLine.qty;
  }

  deleteQuoteLine(index: number) {
   // if this is a editing of an quote delete the line in the backend if it's been saved
    if(this.quote.id !== -1 && this.quoteLines.quoteLines[index].id !== -1) {
      this.quoteService.deleteQuoteLineById(this.quoteLines.quoteLines[index].id)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Quote line could not be deleted. Please try again later.');
        return e;
      }))
      .subscribe(() => {
        this.quoteLines.quoteLines.splice(index, 1);
      })
    } else {
      this.quoteLines.quoteLines.splice(index, 1);
    }

  }

  getNetTotal(): number {
    let total = 0;

    this.quoteLines.quoteLines.forEach(quoteLine => {
      if(quoteLine.qty > 0 && quoteLine.newPrice > 0) {
        total += quoteLine.qty * quoteLine.newPrice;
      }
    });


    return total;
  }

  getVatTotal(): number {
    let netTotal = this.getNetTotal();

    return (netTotal * 0.20);
  }

  foundContactAddress(event){
    this.quote.contactAddressLine1 = event.address1;
    this.quote.contactAddressLine2 = event.address2;
    this.quote.contactAddressLine3 = event.address3;
    this.quote.contactCity = event.city;
    this.quote.contactCountry = event.country;
  }



}
