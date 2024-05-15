import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/order/models/quote.model';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/internal/operators/take';
import { OrderService } from 'src/app/order/services/order.service';
import { catchError } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';
import { QuoteStateService } from '../../services/quote-state.service';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { QuoteValidatorService } from '../../validators/quote-validator.service';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quote-new',
  templateUrl: './quote-new.component.html',
  styleUrls: ['./quote-new.component.scss']
})
export class QuoteNewComponent implements OnInit {

  quote: Quote = new Quote();

  account: Account = new Account();
  site: Account = new Account();
  isServerError: boolean = false;
  isError: boolean = false;

  quoteLines: any = {quoteLines: []};

  constructor(private route: ActivatedRoute,
    private quoteService: QuoteService,
    private quoteValidator: QuoteValidatorService,
    private orderService: OrderService) { }


  ngOnInit(): void {
    this.route.params.subscribe((params) => {

      if(+params['accountId'] !== -1) {
        this.loadAccount(+params['accountId']);
        this.loadSite(+params['siteId']);
      } else {

        // free style just set to new object and default to -1
        this.account = new Account();
        this.site = new Account();
      }
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
      // Quote is tied to site, which is child of account !!!!
      this.quote.accountId = this.site.id;
      this.quote.account.id = this.site.id;
    });
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;


    if(this.quoteValidator.isValid(this.quote)) {

      this.quote.statusId = 1;
      this.quote.quoteStatus = {id: 1};
      this.quoteService.createQuote(this.quote)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((quote: Quote) => {
        this.quoteLines.quoteLines.forEach(quoteLine => {
          quoteLine.quote = quote;
          quoteLine.quoteId = quote.id;
        });

        this.bulkSaveQuoteLines(this.quoteLines.quoteLines);
      })
    } else {
      this.isError = true;
    }
  }

  bulkSaveQuoteLines(quoteLines: QuoteLine[]) {

    if(!quoteLines) {
      this.isServerError = true;
    }

    this.quoteService.createBulkQuoteLines(quoteLines)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {
      // assume all good redirect
      window.location.href = '/quoting';
    })
  }
}
