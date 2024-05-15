import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../../services/quote.service';
import { ActivatedRoute } from '@angular/router';
import { Quote } from 'src/app/order/models/quote.model';
import { take, catchError } from 'rxjs/operators';
import { QuoteStatusHistory } from '../../models/quote-status-history.model';

@Component({
  selector: 'app-quote-accept',
  templateUrl: './quote-accept.component.html',
  styleUrls: ['./quote-accept.component.scss']
})
export class QuoteAcceptComponent implements OnInit {

  quote: Quote = new Quote();
  constructor(private quoteService: QuoteService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadQuote(+params['id']);
    })
  }

  loadQuote(id: number) {
    this.quoteService.getQuoteById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("could not load quote");
      return e;
    }))
    .subscribe((quote: Quote) => {
      this.quote = quote;

      this.saveQuote();
    })
  }

  saveQuote() {
    this.quote.statusId = 2;
    this.quote.quoteStatus = {id: 2};
    this.quoteService.updateQuote(this.quote)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("could not update quote");
      return e;
    }))
    .subscribe((quote: Quote) => {
      this.quote = quote;
      this.saveQuoteStatus();
    })
  }

  saveQuoteStatus() {
    const quoteStatusHistory = new QuoteStatusHistory();
    quoteStatusHistory.notes = "";
    quoteStatusHistory.quoteId = this.quote.id;
    quoteStatusHistory.quote = {id: this.quote.id} as any;
    quoteStatusHistory.quoteStatusId = 2;
    quoteStatusHistory.quoteStatus = {id: 2} as any;

    this.quoteService.createQuoteStatusHistory(quoteStatusHistory)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("could create quote status history");
      return e;
    }))
    .subscribe(() => {
      window.location.href = "/quoting";
    })

  }
}
