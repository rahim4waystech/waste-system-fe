import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { AccountService } from 'src/app/account/services/account.service';
import { catchError, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { OrderService } from 'src/app/order/services/order.service';
import { OrderValidatorService } from 'src/app/order/validators/order-validator.service';
import { JobSignOffValidatorService } from '../../validators/job-signoff-validator.service';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { PodService } from 'src/app/pods/services/pod.service';
import { Account } from 'src/app/order/models/account.model';
import { DriverJobMovement } from 'src/app/pods/models/driver-job-movement.model';
import { PriceListService } from 'src/app/price-list/services/price-list.service';
import { PriceList } from 'src/app/price-list/models/price-list.model';
import { PriceListOtherItem } from 'src/app/price-list/models/price-list-other-item.model';
import { Unit } from 'src/app/order/models/unit.model';

@Component({
  selector: 'app-job-signoff-edit-manager',
  templateUrl: './job-signoff-edit-manager.component.html',
  styleUrls: ['./job-signoff-edit-manager.component.scss']
})
export class JobSignoffEditManagerComponent implements OnInit {

  isError: boolean = false;
  isServerError: boolean = false;
  job: Job = new Job();
  tips: Account[] = [];
  orderLines: OrderLine[] = [];
  orderLinesOriginal: OrderLine[] =[];
  pods: DriverJobMovement[] = [];
  overweightItem: PriceListOtherItem = new PriceListOtherItem();
  units: Unit[] = [];

  constructor(private accountService: AccountService,
    private router: Router,
    private orderValidator: OrderValidatorService,
    private jobValidator: JobSignOffValidatorService,
    private invoiceService: InvoiceService,
    private orderService: OrderService,
    private priceListService: PriceListService,
    private route: ActivatedRoute,
    private podService: PodService,
    private jobService: JobService) { }

  ngOnInit(): void {
    this.accountService.getAllTips()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('tips could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((tips: Account[]) => {
      this.tips = tips;
    });

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load units');
      return e;
    }))
    .subscribe((units: any) => {
      this.units = units;
    });

    this.route.params.subscribe((params) => {
      this.loadJob(+params['id']);
    })

  }


  findAndSetPriceListOverweightCharge() {
    this.priceListService.getActivePriceListsForAccount(this.job.order.accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load price list');
      return e;
    }))
    .subscribe((priceLists: PriceList[]) => {
      // find all items from price lists
      this.priceListService.getAllOtherItemsByPriceListIds(priceLists.map(pl => pl.id))
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('could not price items');
        return e;
      }))
      .subscribe((items: PriceListOtherItem[]) => {
        const item = items.filter((i) => {
          return (i.gradeId === this.job.order.gradeId || i.gradeId === -1) && i.type === 1 && i.active;
        })[0];

        if(item) {
          this.overweightItem = JSON.parse(JSON.stringify(item));
          this.setOverweightCharge();
        }
      })
    })
  }

  loadPODS() {
    this.podService.getPodsByJobId(this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load pods');
      return e;
    }))
    .subscribe((pods: DriverJobMovement[]) => {
      this.pods = pods;
      let podAmount = 0;

      pods.forEach((pod: DriverJobMovement) => {
        podAmount += pod.qty;
      });

      if(podAmount > 0 && !this.job.jobManagerSignOff) {
        this.job.qty = podAmount;
      }

    })

    // this.setQtyTotal();
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
      this.loadPODS();
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
      this.orderLinesOriginal = JSON.parse(JSON.stringify(this.orderLines));

      let primaryCharge = this.orderLines.filter(ol => ol.isPrimaryCharge)[0];

      if(!primaryCharge) {
        primaryCharge = this.orderLines[0];
      }

      primaryCharge.qty = this.job.qty;

      this.findAndSetPriceListOverweightCharge();
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
      alert('could not load tipping price');
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

  setOverweightCharge() {
    const hasOverweight = this.orderLines.filter(ol => ol.overweight).length > 0;
    if(this.job.weight > 0 && !hasOverweight && this.job.hasOverweight) {

        const ol = new OrderLine();
        ol.name = this.overweightItem.name;
        ol.orderId = this.job.orderId;
        ol.order = {id: this.job.orderId} as any;
        ol.overweight = true;
        ol.quoteLine = null;
        ol.quoteLineId = -1;
        ol.price = this.overweightItem.price;
        ol.qty = this.overweightItem.afterAmount > 0 ? (this.job.weight - this.overweightItem.afterAmount) : this.job.weight;
        ol.unitId = this.overweightItem.unitId;
        
        this.orderLines.push(ol);

    } else if(this.job.weight > 0 && hasOverweight && this.job.hasOverweight) {
      const ol = this.orderLines.filter(ol => ol.overweight)[0];
      
      if(ol) {
        ol.price = this.overweightItem.price;
        ol.qty = this.overweightItem.afterAmount > 0 ? (this.job.weight - this.overweightItem.afterAmount) : this.job.weight;
      }

    }
  }

createNewOrderLines(): void {
  this.orderService.deleteOrderLinesForOrderId(this.job.order.id)
  .pipe(take(1))
  .pipe(catchError((e) => {
    this.isServerError = true;
    return e;
  }))
  .subscribe(() => {
    const orderlinesSave = this.orderLines.filter(o => o.qty > 0);
  
    orderlinesSave.forEach(orderLine => {
      orderLine.order.id = this.job.order.id;
      orderLine.orderId = this.job.order.id;
      orderLine.id = -1;

    });

    this.orderLinesOriginal[0].id = -1;


    // Default keep order line same for order
    orderlinesSave[0] = JSON.parse(JSON.stringify(orderlinesSave[0]));

    this.orderLines.forEach((line: OrderLine) => {
      line.quoteLine = {id: line.quoteLineId} as any;
    });

    this.orderLinesOriginal.forEach((line: OrderLine) => {
      line.quoteLine = {id: line.quoteLineId} as any;
    });

    this.orderLinesOriginal[0].id = -1;
    this.orderLines[0] = this.orderLinesOriginal[0];

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
      this.router.navigateByUrl('/job-signoff');

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
      this.router.navigateByUrl('/job-signoff');
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

  getUnitFromId(unitId: number) {
    const unit = this.units.filter(u => u.id === unitId)[0];

    if(!unit) {
      return '';
    }

    return unit.name;
  }

}
