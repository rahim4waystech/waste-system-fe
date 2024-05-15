import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Order } from 'src/app/order/models/order.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { OrderService } from 'src/app/order/services/order.service';
import { take, catchError } from 'rxjs/operators';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { Unit } from 'src/app/order/models/unit.model';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';

@Component({
  selector: 'app-artic-timeline-transport-order-information',
  templateUrl: './artic-timeline-transport-order-information.component.html',
  styleUrls: ['./artic-timeline-transport-order-information.component.scss']
})
export class ArticTimelineTransportOrderInformationComponent implements OnInit,OnChanges {

  @Input()
  order: Order = new Order();
  canDecline: boolean = false;

  units: Unit[] = [];

  constructor(private modalService: ModalService,
    private timelineTransportStateService: TimelineTransportStateService,
    private jobService: JobService,
    private orderService: OrderService) { 

    }

  ngOnInit(): void {
    this.timelineTransportStateService.$transportUnitsChanged.subscribe((units: Unit[]) => {
      this.units = units;
    });
  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.order) {
      if(simple.order.currentValue.id !== -1 && simple.order.currentValue.id) {
        this.jobService.getJobsByOrderId(simple.order.currentValue.id)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('could not get job count');
          return e;
        }))
        .subscribe((jobs: Job[]) => {
          this.canDecline = jobs.length === 0;
        })
      }
    }
  }

  editOrder(orderId: number=-1) {
    this.timelineTransportStateService.$transportOrderIdChanged.next(orderId);
    this.modalService.open('ArtictransportTimelineEditOrderModal');
  } 

  close() {
    this.modalService.close('ArticorderTransportInformationModal');
  }

  getUnitName(unitId: number = -1) {
    let unit = this.units.filter(u => u.id === unitId)[0];

    if(unit) {
      return unit.name;
    } else {
      return '';
    }
  }

}
