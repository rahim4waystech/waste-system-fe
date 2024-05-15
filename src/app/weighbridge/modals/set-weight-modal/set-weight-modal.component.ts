import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { OrderService } from 'src/app/order/services/order.service';
import { ContainerService } from 'src/app/container/services/container.service';
import { catchError, take } from 'rxjs/operators';
import { Grade } from 'src/app/container/models/grade.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PriceListService } from 'src/app/price-list/services/price-list.service';
import { PriceList } from 'src/app/price-list/models/price-list.model';
import { PriceListOtherItem } from 'src/app/price-list/models/price-list-other-item.model';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { Unit } from 'src/app/order/models/unit.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-weight-modal',
  templateUrl: './set-weight-modal.component.html',
  styleUrls: ['./set-weight-modal.component.scss']
})
export class SetWeightModalComponent implements OnInit, OnChanges {

  @Input()
  job: Job = new Job();

  isServerError: boolean = false;
  isError: boolean = false;

  grades: Grade[] = [];

  priceLists: PriceList[] = [];
  otherItems: PriceListOtherItem[] = [];
  orderLines: OrderLine[] = [];
  overweightItem: PriceListOtherItem = new PriceListOtherItem();
  units: Unit[] = [];

  constructor(private containerService: ContainerService,
    private priceListService: PriceListService,
    private orderService: OrderService,
    private router: Router,
    private modalService: ModalService,
    private jobService: JobService) { }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.job) {
      if(simple.job.currentValue.id !== -1) {
        this.orderService.getOrderLinesByOrderId(simple.job.currentValue.order.id)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('could not load price lists');
          return e;
        }))
        .subscribe((lines: any) => {
          this.orderLines = lines;
        })
      }
    }
  }

  findAndSetPriceListOverweightCharge() {
    this.priceListService.getActivePriceListsForAccount(this.job.order.accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load price list');
      return e;
    }))
    .subscribe((priceLists: PriceList[]) => {
      // find all items from price lists
      this.priceListService.getAllOtherItemsByPriceListIds(priceLists.map(pl => pl.id))
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
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

setOverweightCharge() {
  const hasOverweight = this.orderLines.filter(ol => ol.overweight).length > 0;

  const overweightCurrent = this.orderLines.filter(ol => ol.overweight);

  let hasSaved = overweightCurrent.length > 0 ? overweightCurrent[0].id > -1 : false;

  let overweightApplys = this.job.weight > this.overweightItem.afterAmount;

  if(!hasSaved) {
    this.orderLines = this.orderLines.filter(ol => !ol.overweight);
  }
  
  if(this.job.weight > 0 && !hasOverweight && this.job.hasOverweight && !hasSaved && overweightApplys) {

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

  } else if(this.job.weight > 0 && hasOverweight && this.job.hasOverweight && overweightApplys) {
    const ol = this.orderLines.filter(ol => ol.overweight)[0];
    
    if(ol) {
      ol.price = this.overweightItem.price;
      ol.qty = this.overweightItem.afterAmount > 0 ? (this.job.weight - this.overweightItem.afterAmount) : this.job.weight;
    }

  }
}

getTotalPriceForOrderLine(orderLine: OrderLine): number {
  if(!orderLine) {
    throw new Error('orderline must be provided in order form for total price');
  }

  return orderLine.price * orderLine.qty;
}

getUnitFromId(unitId: number) {
  const unit = this.units.filter(u => u.id === unitId)[0];

  if(!unit) {
    return '';
  }

  return unit.name;
}


  ngOnInit(): void {
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
    })

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load units')
      return e;
    }))
    .subscribe((units: Unit[]) => {
      this.units = units;
    })

  }




  save() {
    this.isError = false;
    this.isServerError = false;

    if(!this.job.weight || this.job.order.gradeId === -1) {
      this.isError = true;
      return;
    }

    if(this.job.weight <=0){
      this.job.weight = 0;
    }


    this.job.weightStatusId = 2;

    this.jobService.updateJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe(() => {
      this.createNewOrderLines();
    })

  }

  close() {
      this.modalService.close('setWeightModal');
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
  
  
      // Default keep order line same for order
      orderlinesSave[0] = JSON.parse(JSON.stringify(orderlinesSave[0]));
  
      this.orderLines.forEach((line: OrderLine) => {
        line.quoteLine = {id: line.quoteLineId} as any;
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
      this.modalService.close('setWeightModal');
    })
  }
  
}
