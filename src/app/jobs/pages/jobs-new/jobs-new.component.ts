import { Component, OnInit, Input } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { OrderService } from 'src/app/order/services/order.service';
import { take, catchError } from 'rxjs/operators';
import { Order } from 'src/app/order/models/order.model';
import { ActivatedRoute } from '@angular/router';
import { SkipRound } from 'src/app/timeline-skip/models/skip-round.model';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { SkipRoundService } from 'src/app/timeline-skip/services/skip-round.service';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import * as moment from 'moment';

@Component({
  selector: 'app-jobs-new',
  templateUrl: './jobs-new.component.html',
  styleUrls: ['./jobs-new.component.scss']
})
export class JobsNewComponent implements OnInit {

  @Input()
  job: Job = new Job();

  constructor(private orderService: OrderService,
    private jobService: JobService,
    private skipRoundService: SkipRoundService,
    private jobAssignmentService: JobAssignmentService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadOrder(+params['id']);
    })
  }

  loadOrder(orderId: number) {
    this.orderService.getOrderById(orderId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load order');
      return e;
    }))
    .subscribe((order: Order) => {
      this.job.order = order;
      this.job.orderId = order.id;

      // Set order to allocated
      this.job.order.orderAllocated = true;


      // go forward to accepted
      this.job.jobStatusId = 2;
      this.job.jobStatus.id = 2;

      this.job.date = moment().format('YYYY-MM-DD');
    })
  }

  saveOwnJob() {
    this.jobAssignmentService.checkIfJobAssignmentExistsForDate(this.job.date, this.job.jobAssignment.vehicleId, this.job.jobAssignment.driverId)
    .pipe(take(1))
    .pipe(catchError((e) => {
    this.createSkipRound();
      return e;
    }))
    .subscribe((data: JobAssignment[]) => {
      if(data.length === 0) {
        this.createSkipRound();
      } else {
        const ja = data[0];
        this.job.jobAssignmentId = ja.id;
        this.job.jobAssignment.id = ja.id;
        this.saveJob();
      }
    })
  }

  saveSubbieJob() {
    this.jobAssignmentService.checkIfSubbieJobAssignmentExistsForDate(this.job.date, this.job.jobAssignment.subcontractorId)
    .pipe(take(1))
    .pipe(catchError((e) => {
    this.createSkipRound();
      return e;
    }))
    .subscribe((data: JobAssignment[]) => {
      if(data.length === 0) {
        this.createSkipRound();
      } else {
        const ja = data[0];
        this.job.jobAssignmentId = ja.id;
        this.job.jobAssignment.id = ja.id;
        this.saveJob();
      }
    })
  }

  save() {
    if(this.job.jobAssignment.subcontractorId === -1) {
      this.saveOwnJob();
    } else {
      this.saveSubbieJob();
    }
  }

  createSkipRound() {
    const skipRound = new SkipRound();

    skipRound.driverId = this.job.jobAssignment.driverId;
    skipRound.driver.id = this.job.jobAssignment.driverId;
    skipRound.vehicleId = this.job.jobAssignment.vehicleId;
    skipRound.vehicle.id = this.job.jobAssignment.vehicleId;
    skipRound.subcontractorId = this.job.jobAssignment.subcontractorId;
    skipRound.subcontractor.id = this.job.jobAssignment.subcontractorId;
    skipRound.date = this.job.date;
    skipRound.name = "";
    skipRound.depot.id = this.job.jobAssignment.depotId;
    skipRound.depotId = this.job.jobAssignment.depotId;
    skipRound.subcontractorId  = this.job.jobAssignment.subcontractorId;
   // skipRound.depotId = this.job.jobAssignmen
   skipRound.carryOver = true;
   skipRound.driverStartTime = this.job.jobAssignment.driverStartTime;


   this.skipRoundService.createSkipRound(skipRound)
   .pipe(take(1))
   .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
    alert('could not create skip round. Please try again later.');
    return e;
   }))
   .subscribe((round: SkipRound) => {
     this.createJobAssignment(round);
   })

  }

  createJobAssignment(round: SkipRound) {
    const ja = new JobAssignment();
    ja.skipRoundId = round.id;
    ja.name = "";
    ja.orderTypeId = 1;//skip
    ja.driverStartTime = round.driverStartTime;
    ja.driverId = round.driverId;
    ja.driver.id = round.driverId;
    ja.vehicleId = round.vehicleId;
    ja.vehicle.id = round.vehicleId;
    ja.subcontractorId = round.subcontractorId;
    ja.subcontractor.id = round.subcontractorId;
    ja.depotId = round.depotId;
    ja.depot.id = round.depotId;
    ja.date = round.date;

    this.jobAssignmentService.createJobAssignment(ja)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save job assignment. Please try again later.');
      return e;
    }))
    .subscribe((ja: JobAssignment) => {
      this.job.jobAssignment.id = ja.id;
      this.job.jobAssignmentId = ja.id;
      this.saveJob();
    })
  }

  saveOrder() {
    this.orderService.updateOrder(this.job.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update order');
      return e;
    }))
    .subscribe((data) => {
      window.location.href = '/jobs';
    })
  }

  saveJob() {
    this.jobService.createJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update job');
      return e;
    }))
    .subscribe((data) => {
      this.saveOrder();
    })
  }
}
