import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { OrderType } from 'src/app/order/models/order-type.model';
import { TippingPrice } from 'src/app/account/models/tipping-price.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { OrderService } from 'src/app/order/services/order.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { AccountService } from 'src/app/account/services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderValidatorService } from 'src/app/order/validators/order-validator.service';
import { JobSignOffValidatorService } from 'src/app/job-signoff/validators/job-signoff-validator.service';
import { catchError, take } from 'rxjs/operators';
import { JobStatus } from 'src/app/timeline-skip/models/job-status.model';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-job-signoff-shredder-view',
  templateUrl: './job-signoff-shredder-view.component.html',
  styleUrls: ['./job-signoff-shredder-view.component.scss']
})
export class JobSignoffShredderViewComponent implements OnInit {
  job: Job = new Job()
  types: OrderType[] = [];
  tips: Account[] = [];


  showAdditionalDetails: boolean = false;

  isError: boolean = false;

  constructor(private jobService: JobService,
    private orderService: OrderService,
    private modalService: ModalService,
    private accountService: AccountService,
    private router: Router,
    private orderValidator: OrderValidatorService,
    private jobValidator: JobSignOffValidatorService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadJob(+params['id']);
    })

    this.orderService.getAllOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: OrderType[]) => {
      this.types = types;
    });

    this.accountService.getAllTips()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('tips could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((tips: Account[]) => {
      this.tips = tips;
    });


  }

  loadJob(jobId: number) {

    // If transport sign off make job signed off
    if(this.job.jobSignOffStatusId === 4) {
      this.job.jobStatusId = 4;
    }

    this.jobService.getJobById(jobId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Job could not be loaded')
      return e;
    }))
    .subscribe((job: Job) => {
      this.job = job;
      // If it's not tipped or transport sign off
      if([1, 4].indexOf(this.job.jobSignOffStatusId) !== -1) {
        this.showAdditionalDetails = true;
      }
      this.loadTippingPrice();
    })
  }

  loadTippingPrice() {

    if(this.job.order.tipSiteId === -1 || !this.job.order.tipSiteId) {
      return;
    }

    this.accountService.getTipPriceForSiteAndGrade(this.job.order.tipSiteId, this.job.order.gradeId, this.job.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load tipping price');
      return e;
    }))
    .subscribe((data) => {

      const tippingPrice = data[0];

      if(tippingPrice) {
        this.job.tippingPriceId = tippingPrice.id;
      }
    })
  }

  openModal(modalName: string) {
    this.modalService.open(modalName);
  }

  onStatusChanged($event) {
    this.job.jobSignOffStatusId = +$event.target.value;


    this.showAdditionalDetails = false;


    if(this.job.jobSignOffStatusId === 2) {
      this.openModal('jobSignOffRescheduleModal');
    }

    // Selected charges only
    if(this.job.jobSignOffStatusId === 3) {
      this.openModal('jobSignOffChargesOnlyModal');
    }


    // If it's not tipped or transport sign off or wasted only
    if([1,3, 4].indexOf(this.job.jobSignOffStatusId) !== -1) {
      this.showAdditionalDetails = true;
    }
  }


  save() {


    if((!this.orderValidator.isDataValid(this.job.order, null) || !this.jobValidator.isValid(this.job))) {
      this.isError = true;
      return;
    }

      this.saveOrder();

  }

  saveJob() {
    this.job.jobStatusId = 4;
    this.job.jobStatus = {id: 4} as JobStatus;
    this.jobService.updateJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save job. please try again later');
      return e;
    }))
    .subscribe(() => {
      this.router.navigateByUrl('/job-signoff/shredder');
    })
  }

  saveOrder() {
    this.orderService.updateOrder(this.job.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save order. please try again later');
      return e;
    }))
    .subscribe(() => {
      this.saveJob();
    })
  }

}
