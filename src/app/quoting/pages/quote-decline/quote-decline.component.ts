import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../../services/quote.service';
import { ActivatedRoute } from '@angular/router';
import { take, catchError } from 'rxjs/operators';
import { Quote } from 'src/app/order/models/quote.model';
import { QuoteStatusHistory } from '../../models/quote-status-history.model';

@Component({
  selector: 'app-quote-decline',
  templateUrl: './quote-decline.component.html',
  styleUrls: ['./quote-decline.component.scss']
})
export class QuoteDeclineComponent implements OnInit {

  quote: Quote = new Quote();
  notes: string = "";
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
    })
  }

  onDeclineClicked() {

    if(this.notes === "" || !this.notes) {
      alert('Please select a decline reason');
      return;
    }
    this.saveQuote();

  }

  saveQuote() {
    this.quote.statusId = 3;
    this.quote.quoteStatus = {id: 3};
    this.quoteService.updateQuote(this.quote)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("could update quote");
      return e;
    }))
    .subscribe((quote: Quote) => {
      this.quote = quote;
      this.saveQuoteStatus();
    })
  }

  saveQuoteStatus() {
    const quoteStatusHistory = new QuoteStatusHistory();
    quoteStatusHistory.notes = this.notes;
    quoteStatusHistory.quoteId = this.quote.id;
    quoteStatusHistory.quote = {id: this.quote.id} as any;
    quoteStatusHistory.quoteStatusId = 3;
    quoteStatusHistory.quoteStatus = {id: 3} as any;

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
