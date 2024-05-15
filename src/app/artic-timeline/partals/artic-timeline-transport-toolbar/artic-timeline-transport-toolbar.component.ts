import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { take, catchError } from 'rxjs/operators';
import { OrderService } from 'src/app/order/services/order.service';
import { Order } from 'src/app/order/models/order.model';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';
import { TimelineHistoryEvent, TimelineHistoryEventType, TimelineTransportHistoryService } from 'src/app/timeline-transport/services/timeline-transport-history.service';
import { TransportTimelineHistoryActionService } from 'src/app/timeline-transport/services/transport-timeline-history-action.service';

@Component({
  selector: 'app-artic-timeline-transport-toolbar',
  templateUrl: './artic-timeline-transport-toolbar.component.html',
  styleUrls: ['./artic-timeline-transport-toolbar.component.scss']
})
export class ArticTimelineTransportToolbarComponent implements OnInit {

  isDatePickerVisible: boolean = false;
 
  selectedJobs: Job[] = [];

  date: Date = moment().toDate();

  orderTypeId: number = 4;

  vehicleTypes:any = [];

  jobAssignments: JobAssignment[] = [];

  copyDate: string = '';

  constructor(private modalService: ModalService,
    private jobService: JobService,
    private orderService: OrderService,
    private jobAssignmentService: JobAssignmentService,
    private timelineTransportHistoryService: TimelineTransportHistoryService,
    private transportTimelineHistoryActionService: TransportTimelineHistoryActionService,
    private timelineTransportStateService: TimelineTransportStateService) { }

  ngOnInit(): void {
    
    this.timelineTransportStateService.$transportSelectedJobsChanged.subscribe((jobs: Job[]) => {
      this.selectedJobs = jobs;
    })

    this.timelineTransportStateService.$transportJobAssignmentsUpdated.subscribe((assignments:any) => {
      this.jobAssignments = assignments;
    })


    this.vehicleTypes = environment.timelineOptions;

    const lcDate = localStorage.getItem('MJL_TRANSPORT_TIMELINE_DATE');
    
    if(lcDate && lcDate !== '') {
      this.date = moment(lcDate).toDate();
    }

    // this.timelineTransportStateService.$transportDateChanged.next(this.date);
  }

  undo() {
    // undo last action from history stack
    let event: TimelineHistoryEvent = this.timelineTransportHistoryService.getLastitem();
    this.transportTimelineHistoryActionService.undoAction(event);

  }

  addRow() {
    this.modalService.open('ArtictransportRowCreationModal');
  }

  showVorAndAbsence() {
    this.modalService.open('ArticvorModal');
  }

  onAddNoteClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to add note');
      return;
    }

    this.modalService.open('ArtictransportNoteCreationModal');
  }
  onApproveJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to approve');
      return;
    }


    if(this.isAnyJobsSignedOffOrInvoiced(this.selectedJobs)) {
      alert('You cannot approve complete or invoiced jobs');
      return;
    }

    this.selectedJobs.forEach((job) => {
      job.jobStatusId = 2; //approved
    });

    this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.approveJobs, this.selectedJobs);

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

      this.timelineTransportStateService.$transportSelectedJobsChanged.next([]);
      this.timelineTransportStateService.$transportActiveBlockNumberChange.next(-1);

    })

  }

  copyJobs() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to approve');
      return;
    }

    this.jobAssignmentService.copyJobs(JSON.parse(JSON.stringify(this.jobAssignments)),JSON.parse(JSON.stringify(this.selectedJobs)), moment(this.copyDate).format('YYYY-MM-DD'), this.orderTypeId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not copy jobs');
      return e;
    }))
    .subscribe(() => {
      alert("Selected jobs have been copied to the supplied date");
      this.timelineTransportStateService.$transportSelectedJobsChanged.next([]);
      this.timelineTransportStateService.$transportActiveBlockNumberChange.next(-1);
    })
  }

  onUnapproveJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to approve');
      return;
    }


    if(this.isAnyJobsSignedOffOrInvoiced(this.selectedJobs)) {
      alert('You cannot unapprove completed or invoiced jobs');
      return;
    }

    this.selectedJobs.forEach((job) => {
      job.jobStatusId = 1; //pending
    });


    this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.unapproveJobs, this.selectedJobs);


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
      this.timelineTransportStateService.$transportSelectedJobsChanged.next([]);
      this.timelineTransportStateService.$transportActiveBlockNumberChange.next(-1);
    })

  }

  onEditJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to edit');
      return;
    }


    if(this.isAnyJobsSignedOffOrInvoiced(this.selectedJobs)) {
      alert('You cannot edit complete or invoiced jobs');
      return;
    }

    this.modalService.open('ArtictransportJobEditModal');
  }

  onDeletedJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to delete');
      return;
    }

    if(this.isAnyJobsSignedOffOrInvoiced(this.selectedJobs)) {
      alert('You cannot delete completed or invoiced jobs');
      return;
    }

    this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.deleteJobs, {old: JSON.parse(JSON.stringify(this.selectedJobs)), records: this.selectedJobs});

    
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
      // this.bulkUpdateOrders(ordersToUpdate);
      this.timelineTransportStateService.$transportSelectedJobsChanged.next([]);
      this.timelineTransportStateService.$transportActiveBlockNumberChange.next(-1);
      this.timelineTransportStateService.$transportJobAssignmentsUpdated.next(this.jobAssignments);
    })

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
      this.timelineTransportStateService.$transportSelectedJobsChanged.next([]);
      this.timelineTransportStateService.$transportActiveBlockNumberChange.next(-1);
    })

  }

  getFormattedDate(): string {
    return moment(this.date).format('dddd MMMM Do YYYY');
  }

  nextDay() {
    this.date = moment(this.date).add(1, 'days').toDate();
    localStorage.setItem('MJL_TRANSPORT_TIMELINE_DATE', moment(this.date).format('YYYY-MM-DD'));
    this.timelineTransportHistoryService.clear(); 
    this.timelineTransportStateService.$transportDateChanged.next(this.date);
  }

  prevDay() {
    this.date = moment(this.date).subtract(1, 'days').toDate();
    localStorage.setItem('MJL_TRANSPORT_TIMELINE_DATE', moment(this.date).format('YYYY-MM-DD'));
    this.timelineTransportHistoryService.clear(); 
    this.timelineTransportStateService.$transportDateChanged.next(this.date);
  }

onDateSelected($event) {

    // make sure inital setting of value doesn't hide the datepicker
    if(moment(this.date).unix() !== moment($event).unix()) {
      this.isDatePickerVisible = false;
    }

    this.date = $event;

    this.timelineTransportStateService.$transportDateChanged.next(this.date);
    this.timelineTransportHistoryService.clear(); 
    localStorage.setItem('MJL_TRANSPORT_TIMELINE_DATE', moment(this.date).format('YYYY-MM-DD'));
  }

  onOrderTypeChanged($event) {
    this.orderTypeId = parseInt($event.target.value, 10);

    this.timelineTransportStateService.$transportOrderTypeChanged.next(this.orderTypeId);
  }

  isAnyJobsSignedOffOrInvoiced(jobs: Job[]) {
    return jobs.filter(j => j.jobStatusId > 3).length > 0;
  }

  undoAction() {
    let event: TimelineHistoryEvent = this.timelineTransportHistoryService.getLastitem();

    this.transportTimelineHistoryActionService.undoAction(event);

  }




}
