import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { OrderValidatorService } from '../../validators/order-validator.service';
import { OrderService } from '../../services/order.service';
import { take, catchError } from 'rxjs/operators';
import { OrderLine } from '../../models/order-line.model';
import { OrderStateService } from '../../services/order-state.service';
import { MaterialUplift } from '../../models/material-uplift.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';
import { TipTicketService } from 'src/app/job-signoff-land-services/services/tip-ticket.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {

  // TODO: BLOCK editing certain areas if on timeline

  order: Order = new Order();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  orderLines: any = {orderLines: []};

  fromTime: string = '';
  toTime: string = '';

  materialUplifts: any = {materialUplifts: []};

  @Input()
  isPopup: boolean = false;

  canEdit: boolean = false


constructor(private route: ActivatedRoute,
    private orderValidator: OrderValidatorService,
    private modalService: ModalService,
    private tipTicketService: TipTicketService,
    private orderStateService: OrderStateService,
    private timelineTransportStateService: TimelineTransportStateService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if(!this.isPopup) {
        this.loadOrder(+params['id']);
      }
    });

    // used for loading a modal in popup mode
    this.timelineTransportStateService.$transportOrderIdChanged.subscribe((id: number) => {
      this.loadOrder(+id);
    })
  }

  loadOrder(id: number): void {

    // when updating in place for modal
    this.isServerError = false;
    this.isSuccess = false;
    this.isError = false;
    this.orderService.getOrderById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((order: Order) => {
      this.order = order;

      // must be time range
      if(["AM", "PM", "ASAP"].indexOf(this.order.time) === -1) {
        const timeParts = this.order.time.split('-');

        if(timeParts.length === 2) {
          this.fromTime = timeParts[0].trim();
          this.toTime = timeParts[1].trim();
        } else {
          this.fromTime = this.order.time;
          this.toTime = this.order.time;
        }
      }

      this.loadOrderLines();
      this.loadMaterialUplifts();
    })
  }

  loadMaterialUplifts() {
    this.orderService.getUpliftsByOrderId(this.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((uplifts: MaterialUplift[]) => {
      this.materialUplifts.materialUplifts = uplifts;
    });
  }

  loadOrderLines() {
    this.orderService.getOrderLinesByOrderId(this.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((orderLines: OrderLine[]) => {

      this.canEdit = true;
      this.orderLines.orderLines = orderLines;

      this.orderStateService.orderLinesChanged$.next(orderLines);


      // Make sure correct quoteId is extracted from quote assume one quote per order
      if(this.orderLines.orderLines.length > 0) {
        const quoteId = this.orderLines.orderLines[0].quoteLine.quoteId;
        this.orderStateService.quoteIdChanged$.next(quoteId);
      }

    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.orderValidator.isDataValid(this.order, this.orderLines)) {
      // try to save it


      // if this is a decline set to pending
      // Assumption being someone has saved if intention of making it reviewed again.
      if(this.order.orderStatusId === 3) {
        this.order.orderStatusId = 1;
        this.order.orderStatus.id = 1;
      }

      this.orderService.updateOrder(this.order)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        this.createNewOrderLines();
      })
    } else {
      this.isError = true;
    }
  }

  createNewUplifts(): void {
    this.orderService.deleteUpliftsForOrderId(this.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe(() => {
      // get orderlines supplied

      const upliftsSave = this.materialUplifts.materialUplifts.filter(o => o.qty > 0 || o.isPrimaryCharge);

      upliftsSave.forEach(lift => {
        lift.order = {id: this.order.id} as any;
        lift.orderId = this.order.id;
        lift.id = -1;

      });
      this.bulkSaveMaterialUplifts(upliftsSave);
    })
  }


  bulkSaveMaterialUplifts(materialUplifts: MaterialUplift[]) {
    this.orderService.createBulkUplifts(materialUplifts)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not create uplifts');
      return e;
    }))
    .subscribe(() => {
      this.regenTipTickets();
    })
  }

  createNewOrderLines(): void {
    this.orderService.deleteOrderLinesForOrderId(this.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe(() => {
      // get orderlines supplied

      const orderlinesSave = this.orderLines.orderLines.filter(o => o.qty > 0 || o.isPrimaryCharge);

      orderlinesSave.forEach(orderLine => {
        orderLine.order.id = this.order.id;
        orderLine.orderId = this.order.id;
        orderLine.id = -1;

      });
      this.bulkSaveOrderLines(this.orderLines.orderLines);
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
      this.isSuccess = true;

      if(this.materialUplifts.materialUplifts.length === 0) {
        this.regenTipTickets();
      } else {
        this.createNewUplifts();
      }
    })
  }

  cancel() {
    if(!this.isPopup) {
      window.location.href = '/orders';
    } else {
      this.modalService.close('transportTimelineEditOrderModal');
      this.timelineTransportStateService.$transportEditOrderDialogueClosed.next(true);
    }
  }

  regenTipTickets() {
    this.tipTicketService.regenTicketsFromOrder(this.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      return e;
    }))
    .subscribe(() => {
      if(!this.isPopup) {
        window.location.href = '/orders';
      } else {
        this.modalService.close('transportTimelineEditOrderModal');
        this.timelineTransportStateService.$transportEditOrderDialogueClosed.next(true);
      }
    })
  }


}
