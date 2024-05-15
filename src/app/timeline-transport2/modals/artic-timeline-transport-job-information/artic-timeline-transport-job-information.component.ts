import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { take, catchError } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { JobSignoffLandStateService } from 'src/app/job-signoff-land-services/services/job-signoff-land-state.service';
import { Order } from 'src/app/order/models/order.model';
import { OrderService } from 'src/app/order/services/order.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';


@Component({
  selector: 'app-artic-timeline-transport-job-information',
  templateUrl: './artic-timeline-transport-job-information.component.html',
  styleUrls: ['./artic-timeline-transport-job-information.component.scss']
})
export class ArticTimelineTransportJobInformationComponent implements OnInit, OnChanges {

  @Input()
  job: Job = new Job();
  canDecline: boolean = false;

  constructor(private modalService: ModalService,
    private jobSignoffLandStateService: JobSignoffLandStateService,
    private timelineTransportStateService: TimelineTransportStateService,
    private jobService: JobService,
    private orderService: OrderService) { 

    }

  ngOnInit(): void {
    
  }

  editOrder(orderId: number=-1) {
    this.timelineTransportStateService.$transportOrderIdChanged.next(orderId);
    this.modalService.open('ArtictransportTimelineEditOrderModal');
    this.modalService.close('ArticjobTransportInformationModal');
  }

  editJob(jobId: number=-1) {
    this.jobSignoffLandStateService.$jobIdChanged.next(jobId);
    this.modalService.open('jobSignOffLandEditJobModal');
  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.order) {
      if(simple.order.currentValue.id !== -1 && simple.order.currentValue.id) {
        this.jobService.getJobsByOrderId(simple.order.currentValue.id)
        .pipe(take(1))
        .pipe(catchError((e) => {
          alert('could not get job count');
          return e;
        }))
        .subscribe((jobs: Job[]) => {
          this.canDecline = jobs.length === 0;
        })
      }
    }
  }

  close() {
    this.modalService.close('ArticjobTransportInformationModal');
  }

}
