import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { ActivatedRoute } from '@angular/router';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { take, catchError, skip } from 'rxjs/operators';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { OrderService } from 'src/app/order/services/order.service';
import { SkipRound } from 'src/app/timeline-skip/models/skip-round.model';
import { SkipRoundService } from 'src/app/timeline-skip/services/skip-round.service';

@Component({
  selector: 'app-jobs-edit',
  templateUrl: './jobs-edit.component.html',
  styleUrls: ['./jobs-edit.component.scss']
})
export class JobsEditComponent implements OnInit {

  job: Job = new Job();

  constructor(private jobService: JobService,
    private orderService: OrderService,
    private skipRoundService: SkipRoundService,
    private jobAssignmentService: JobAssignmentService,
    private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadJob(+params['id']);
    })
  }

  loadJob(id: number) {

    if(!id || id === -1) {
      alert('Must have a valid id for job');
      return;
    }

    this.jobService.getJobById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load job by id');
      return e;
    }))
    .subscribe((job: Job) => {
      this.job = job;
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
    this.jobService.updateJob(this.job)
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
