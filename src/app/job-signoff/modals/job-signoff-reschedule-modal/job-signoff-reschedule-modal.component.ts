import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { OrderService } from 'src/app/order/services/order.service';
import { take, catchError } from 'rxjs/operators';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Router } from '@angular/router';
import { JobSignOffValidatorService } from '../../validators/job-signoff-validator.service';

@Component({
  selector: 'app-job-signoff-reschedule-modal',
  templateUrl: './job-signoff-reschedule-modal.component.html',
  styleUrls: ['./job-signoff-reschedule-modal.component.scss']
})
export class JobSignoffRescheduleModalComponent implements OnInit, OnChanges {

  isError: boolean = false;
  isServerError: boolean = false;

  @Input()
  job: Job = new Job();

  constructor(private modalService: ModalService,
    private jobSignOffValidatorService: JobSignOffValidatorService,
    private router: Router,
    private jobService: JobService,
    private orderService: OrderService) { }

  ngOnInit(): void {
  }

  close() {
    this.modalService.close('jobSignOffRescheduleModal')
  }

  save() {
    this.isServerError = false;
    this.isError = false;

    if(!this.jobSignOffValidatorService.isValid(this.job)) {
      this.isError = true;
      return;
    }


    // Set job to deleted status change and update order.
    this.job.jobStatusId = 3;

    this.orderService.updateOrder(this.job.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {
      this.saveJob();
    })

  }

  saveJob() {
    this.jobService.updateJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) =>  {
      this.router.navigateByUrl('/job-signoff');
    })
  }

  ngOnChanges(simple: SimpleChanges) {
  }

}
