import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';
import { SkipTimelineStateService } from '../../services/skip-timeline-state.service';
import { Job } from '../../models/job.model';
import { JobService } from '../../services/job.service';
import { take, catchError } from 'rxjs/operators';
import { OrderService } from 'src/app/order/services/order.service';
import { Order } from 'src/app/order/models/order.model';

@Component({
  selector: 'app-timeline-skip-toolbar',
  templateUrl: './timeline-skip-toolbar.component.html',
  styleUrls: ['./timeline-skip-toolbar.component.scss']
})
export class TimelineSkipToolbarComponent implements OnInit {

  date: Date = moment().toDate();

  selectedJobs: Job[] = [];

  isDatePickerVisible:boolean = false;
  isSubcontractorsVisible: boolean = true;


  constructor(private modalService: ModalService,
    private orderService: OrderService,
    private jobService: JobService,
    private skipTimelineStateService: SkipTimelineStateService) { }

  ngOnInit(): void {
    this.skipTimelineStateService.$skipTimelineSelectedJobsChanged
    .subscribe((jobs: Job[]) => {
      this.selectedJobs = jobs;
    })
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  onDateSelected($event) {

    // make sure inital setting of value doesn't hide the datepicker
    if(moment(this.date).unix() !== moment($event).unix()) {
      this.isDatePickerVisible = false;
    }

    this.date = $event;

    this.skipTimelineStateService.$skipDateChanged.next(this.date);
  }

  getFormattedDate(): string {
    return moment(this.date).format('dddd MMMM Do YYYY');
  }

  nextDay() {
    this.date = moment(this.date).add(1, 'days').toDate();
    this.skipTimelineStateService.$skipDateChanged.next(this.date);
  }

  prevDay() {
    this.date = moment(this.date).subtract(1, 'days').toDate();
    this.skipTimelineStateService.$skipDateChanged.next(this.date);
  }

  onVehicleTypeChanged($event) {
    this.skipTimelineStateService.$skipVehicleTypeChanged.next(+$event.target.value);
  }

  onApproveJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to approve');
      return;
    }

    this.selectedJobs.forEach((job) => {
      job.jobStatusId = 2; //approved
    });

    this.jobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update jobs for approval');

      this.selectedJobs.forEach((job) => {
        job.jobStatusId = 1; //pending
      });
      return e;
    }))
    .subscribe((jobs) => {
      alert("Selected jobs have been approved");
      this.skipTimelineStateService.$skipTimelineSelectedJobsChanged.next([]);
    })

  }

  onUnapproveJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to approve');
      return;
    }

    this.selectedJobs.forEach((job) => {
      job.jobStatusId = 1; //pending
    });



    this.jobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update jobs to undo approval');
      return e;
    }))
    .subscribe((jobs) => {
      alert("Selected jobs have been set back to pending");
      this.skipTimelineStateService.$skipTimelineSelectedJobsChanged.next([]);
    })

  }

  onDeletedJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to delete');
      return;
    }

    this.selectedJobs.forEach((job) => {
      job.jobStatusId = 3; //deleted
    });

    const ordersToUpdate = this.selectedJobs.map(sj => sj.order);



    this.jobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update jobs to delete');
      return e;
    }))
    .subscribe((jobs) => {
      this.bulkUpdateOrders(ordersToUpdate);
    })

  }

  onSubToggleChanged($event) {
   this.skipTimelineStateService.$skipSubcontractorToggleChanged.next(!this.isSubcontractorsVisible);
  }

  bulkUpdateOrders(orders: Order[]) {

    orders.forEach((o) => {
      o.orderAllocated = false;
    })

    this.orderService.bulkUpdateOrders(orders)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("could not update orders please try again later.")
      return e;
    }))
    .subscribe(() => {
      alert("Selected jobs have been deleted");
      this.skipTimelineStateService.$skipTimelineSelectedJobsChanged.next([]);
      this.skipTimelineStateService.$skipReloadAcceptedJobs.next(true);
    })

  }

}
