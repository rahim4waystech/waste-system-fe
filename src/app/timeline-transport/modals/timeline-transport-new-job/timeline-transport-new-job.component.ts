import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { TimelineTransportStateService } from '../../services/timeline-transport-state.service';
import { AddJobValidatorService } from '../../validators/add-job-validator.service';
import { OrderService } from 'src/app/order/services/order.service';
import { take, catchError } from 'rxjs/operators';
import { Unit } from 'src/app/order/models/unit.model';
import { Order } from 'src/app/order/models/order.model';

@Component({
  selector: 'app-timeline-transport-new-job',
  templateUrl: './timeline-transport-new-job.component.html',
  styleUrls: ['./timeline-transport-new-job.component.scss']
})
export class TimelineTransportNewJobComponent implements OnInit, OnChanges {

  isError: boolean = false;
  isServerError: boolean = false;

  units: Unit[] = [];

  @Input()
  job: any = new Job();
  constructor(private modalService: ModalService,
    private orderService: OrderService,
    private addJobValidatorService: AddJobValidatorService,
    private timelineTransportStateService: TimelineTransportStateService) { }

  ngOnInit(): void {; 
    this.isError = false;

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load untis');
      return e;
    }))
    .subscribe((units: any) => {
      this.units = units;
    })

  }

  ngOnChanges(simple: SimpleChanges) {
    // if(simple.job) {
    //   if(simple.job.currentValue.time === "") {
    //     this.job.time = "07:30";
    //   }
    // }
  }

  getUnitForJob() {


    const job = this.job;

    if(!job.order.orderLines) {
      return 'N/A';
    } 

    let orderLine = job.order?.orderLines.filter(ol => ol.isPrimaryCharge)[0];

    if(!orderLine) {
      orderLine = job.order.orderLines[0];
    }

    
    const unit = this.units.filter(u => u.id === orderLine.quoteLine?.product.unitId)[0];
  
    if(unit) {
      return unit.name;
    } else {
      // must be quick item
      const unitpl = this.units.filter(u => u.id === orderLine.unitId)[0];

      if(!unitpl) {
        return 'N/A';
      }

      return unitpl.name;
    }

  }
  save() {

    this.isError = false;
debugger;
    if(!this.addJobValidatorService.isValid(this.job)) {
      this.isError = true;
      return;
    }

    // save order with suggested time
    const ordernew: Order = JSON.parse(JSON.stringify(this.job.order));

    ordernew.suggestedTime = this.job.time;

    delete ordernew['orderLines'];
    delete ordernew['updatedUser'];
    this.orderService.updateOrder(ordernew)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update the order');
      return e;
    }))
    .subscribe((order) => {

      this.timelineTransportStateService.$transportNewJobDialogClosed.next(this.job);
      this.cancel();
    });
  }

  cancel() {
    this.modalService.close('transportJobCreationModal');
  }

}
