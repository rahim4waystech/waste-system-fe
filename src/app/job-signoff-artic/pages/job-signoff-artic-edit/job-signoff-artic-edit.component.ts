import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderValidatorService } from 'src/app/order/validators/order-validator.service';
import { JobSignOffValidatorService } from 'src/app/job-signoff/validators/job-signoff-validator.service';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { OrderService } from 'src/app/order/services/order.service';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { catchError, take } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-job-signoff-artic-edit',
  templateUrl: './job-signoff-artic-edit.component.html',
  styleUrls: ['./job-signoff-artic-edit.component.scss']
})
export class JobSignoffArticEditComponent implements OnInit {

  isError: boolean = false;
  isServerError: boolean = false;
  job: Job = new Job();
  tips: Account[] = [];
  orderLines: OrderLine[] = [];

  constructor(private accountService: AccountService,
    private router: Router,
    private orderValidator: OrderValidatorService,
    private jobValidator: JobSignOffValidatorService,
    private invoiceService: InvoiceService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private jobService: JobService) { }

  ngOnInit(): void {
    this.accountService.getAllTips()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('tips could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((tips: Account[]) => {
      this.tips = tips;
    });

    this.route.params.subscribe((params) => {
      this.loadJob(+params['id']);
    })

  }

  loadJob(jobId: number) {

    // If transport sign off make job signed off
    if(this.job.jobSignOffStatusId === 4) {
      this.job.jobStatusId = 4;
    }

    this.jobService.getJobById(jobId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Job could not be loaded')
      return e;
    }))
    .subscribe((job: Job) => {
      this.job = job;

      this.loadTippingPrice();
      this.loadOrderLines();
    })
  }

  loadOrderLines() {
    this.orderService.getOrderLinesByOrderId(this.job.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((orderLines: OrderLine[]) => {
      this.orderLines = orderLines;
    })
  }

  getTotalPriceForOrderLine(orderLine: OrderLine): number {
    if(!orderLine) {
      throw new Error('orderline must be provided in order form for total price');
    }

    return orderLine.price * orderLine.qty;
  }


  loadTippingPrice() {

    if(this.job.order.tipSiteId === -1 || !this.job.order.tipSiteId) {
      return;
    }

    this.accountService.getTipPriceForSiteAndGrade(this.job.order.tipSiteId, this.job.order.gradeId, this.job.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      // alert('could not load tipping price');
      return e;
    }))
    .subscribe((data) => {

      const tippingPrice = data[0];

      if(tippingPrice) {
        this.job.tippingPriceId = tippingPrice.id;
      }
    })
  }


  save() {

    this.isError = false;

    if((!this.orderValidator.isDataValid(this.job.order, null) || !this.jobValidator.isValid(this.job))) {
      this.isError = true;
      return;
    }
      this.saveOrder();
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
    if(this.job.jobManagerSignOff) {
        this.assignToInvoice(this.job);
    } else {
      this.router.navigateByUrl('/job-signoff/artic');
    }

  })
}

  assignToInvoice(job: Job) {
    this.invoiceService.assignJobToInvoice(job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Could not assign job to invoice");
      return e;
    }))
    .subscribe(() => {
      this.router.navigateByUrl('/job-signoff/artic');
    })
  }

  saveJob() {
    this.jobService.updateJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save job. please try again later');
      return e;
    }))
    .subscribe(() => {
      this.createNewOrderLines();

    })
  }

  saveOrder() {
    this.orderService.updateOrder(this.job.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save order. please try again later');
      return e;
    }))
    .subscribe(() => {
      this.saveJob();
    })
  }

}
