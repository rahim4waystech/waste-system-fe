import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { QuoteService } from 'src/app/quoting/services/quote.service';
import { OrderService } from 'src/app/order/services/order.service';
import { take, catchError } from 'rxjs/operators';
import { Quote } from 'src/app/order/models/quote.model';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { PriceList } from 'src/app/price-list/models/price-list.model';
import { PriceListService } from 'src/app/price-list/services/price-list.service';
import { PriceListItem } from 'src/app/price-list/models/price-list-item.model';

@Component({
  selector: 'app-job-signoff-charges-only',
  templateUrl: './job-signoff-charges-only.component.html',
  styleUrls: ['./job-signoff-charges-only.component.scss']
})
export class JobSignoffChargesOnlyComponent implements OnInit, OnChanges {

  @Input()
  job: any;

  quotes: Quote[] = [];

  orderLines: OrderLine[] = [];
  quoteLines: QuoteLine[] = [];

  pricelistItems: PriceListItem[] = [];

  priceListType: string = 'quote';

  isError = false;
  isServerError = false;


  priceLists: PriceList[] = [];
  priceListItemId: number = -1;

  constructor(private modalService: ModalService,
    private jobService: JobService,
    private pricelistService: PriceListService,
    private invoiceService: InvoiceService,
    private router: Router,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadQuotes();
  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.job !== undefined) {
      if(simple.job.currentValue.order.siteId !== -1) {
        this.loadQuotes();
        this.loadPriceLists();
      }
    }
  }

  loadPriceLists() {
    this.pricelistService.getActivePriceListsForAccount(this.job.order.accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load price lists');
      return e;
    }))
    .subscribe((lists: PriceList[]) => {
      this.priceLists = lists;
    })
  }

  loadQuotes() {
    this.orderService.getQuotesBySiteId(this.job.order.siteId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load quotes')
      return e;
    }))
    .subscribe((quotes: Quote[]) => {
      this.quotes = quotes;
    })
  }

  onQuoteChanged($event) {
    const quoteId = +$event.target.value;

    this.loadQuoteLines(quoteId);
  }

  onPriceListChanged($event) {
    const priceListId = +$event.target.value;
    this.loadPriceListItems(priceListId);
  }

  loadPriceListItems(priceListId: number) {
    this.pricelistService.getAllItemsByPriceListIdExpanded(priceListId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load price list items');
      return e;
    }))
    .subscribe((items: PriceListItem[]) => {
      this.pricelistItems = items;
    })
  }

  onAddItemForPriceList() {

    if(this.priceListItemId === -1) {
      alert('Please select a price list item');
      return;
    }

    const line: PriceListItem = this.pricelistItems.filter(pli => pli.id === this.priceListItemId)[0];
    const orderLine: any = new OrderLine();
    orderLine.quoteLine = {id: -1} as any;
    orderLine.quoteLineId = -1;
    orderLine.qty = 0;
    orderLine.unitId = line.unitId;
    orderLine.unit = line.unit;
    orderLine.name = line.name;
    orderLine.price = line.price;
    this.orderLines.push(orderLine);
    this.priceListItemId = -1;
  }

  loadQuoteLines(quoteId: number) {

      this.quoteLines = [];
      this.orderLines = [];

      if(quoteId === -1) {
        return;
      }

      if(!quoteId) {
        throw new Error('Order form is missing quote id to load quote')
      }
      this.orderService.getQuoteLinesByQuoteId(quoteId)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('Quote lines could not be loaded for quote in order form');
        return e;
      }))
      .subscribe((data: QuoteLine[]) => {
        this.quoteLines = data;

        this.quoteLines.forEach((line) => {
          const orderLine: OrderLine = new OrderLine();
          orderLine.quoteLine = line;
          orderLine.quoteLineId = line.id;
          orderLine.qty = 0;
          orderLine.price = line.newPrice;
          this.orderLines.push(orderLine);
        });

      })
    }

  close() {
    this.modalService.close('jobSignOffChargesOnlyModal')
  }

  getTotalPriceForOrderLine(orderLine: OrderLine): number {
    if(!orderLine) {
      throw new Error('orderline must be provided in order form for total price');
    }

    return orderLine.price * orderLine.qty;
  }
  save() {
    this.isServerError = false;
    this.isError = false;

    // if(!this.jobSignOffValidatorService.isValid(this.job)) {
    //   this.isError = true;
    //   return;
    // }

    this.orderService.updateOrder(this.job.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {
      this.saveJob();
    })

  }

  saveJob() {
    this.job.jobManagerSignOff = true;
    this.jobService.updateJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) =>  {
      this.createNewOrderLines();
    })
  }


  createNewOrderLines(): void {
    this.orderService.deleteOrderLinesForOrderId(this.job.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe(() => {
      // get orderlines supplied
      const orderlinesSave = this.orderLines.filter(o => o.qty > 0);

      orderlinesSave.forEach(orderLine => {
        orderLine.order.id = this.job.order.id;
        orderLine.orderId = this.job.order.id;
        orderLine.id = -1;

      });
      this.bulkSaveOrderLines(this.orderLines);
    })
  }

  bulkSaveOrderLines(orderLines: OrderLine[]) {
    if(!orderLines) {
      this.isServerError = true;
    }

    this.orderService.createBulkOrderLines(orderLines)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {
      if(this.job.chargeable) {
        this.job.order.orderLines = orderLines;
        this.assignJobToInvoice(this.job);
      } else {
      this.router.navigateByUrl('/job-signoff');
      }
    })
  }

  assignJobToInvoice(job: Job) {
    this.invoiceService.assignJobsToInvoice([job])
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Cannot assign job to invoice')
      return e;
    }))
    .subscribe((data) => {
      this.router.navigateByUrl('/job-signoff');
    })
  }




}
