import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { OrderType } from 'src/app/order/models/order-type.model';
import { OrderService } from 'src/app/order/services/order.service';
import { SkipOrderType } from 'src/app/order/models/skip-order-type.model';
import { ContainerService } from 'src/app/container/services/container.service';
import { ContainerSizeType } from 'src/app/container/models/container-size-type.model';
import { ContainerType } from 'src/app/container/models/container-type.model';
import { Grade } from 'src/app/container/models/grade.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { Container } from 'src/app/container/models/container.model';
import { JobSignOffValidatorService } from '../../validators/job-signoff-validator.service';
import { OrderValidatorService } from 'src/app/order/validators/order-validator.service';
import { AccountService } from 'src/app/account/services/account.service';
import { TippingPrice } from 'src/app/account/models/tipping-price.model';

import { Account } from 'src/app/order/models/account.model';
import { JobStatus } from 'src/app/timeline-skip/models/job-status.model';
import { DriverJobMovement } from 'src/app/pods/models/driver-job-movement.model';
import { PodService } from 'src/app/pods/services/pod.service';
import { JobSmartWaste } from 'src/app/timeline-skip/models/job-smart-waste.model';
import { DocumentService } from 'src/app/core/services/document.service';

@Component({
  selector: 'app-job-signoff-view',
  templateUrl: './job-signoff-view.component.html',
  styleUrls: ['./job-signoff-view.component.scss']
})
export class JobSignoffViewComponent implements OnInit {

  job: Job = new Job()
  types: OrderType[] = [];
  skipOrderTypes: SkipOrderType[] = [];
  containerSizes: ContainerSizeType[] = [];
  containerTypes: ContainerType[] = [];
  grades: Grade[] = [];
  tips: Account[] = [];
  pods: DriverJobMovement[] = [];
  jobSmartWaste: JobSmartWaste[] = [];
  documents: Document[] = [];
  images: any = [];

  containers: Container[] = [];

  tippingPrice: TippingPrice = new TippingPrice();

  showAdditionalDetails: boolean = false;

  isError: boolean = false;

  constructor(private jobService: JobService,
    private orderService: OrderService,
    private podService: PodService,
    private modalService: ModalService,
    private accountService: AccountService,
    private router: Router,
    private orderValidator: OrderValidatorService,
    private jobValidator: JobSignOffValidatorService,
    private containerService: ContainerService,
    private documentService: DocumentService,
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


    this.orderService.getAllSkipOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: SkipOrderType[]) => {
      this.skipOrderTypes = types;
    });

    this.containerService.getAllContainerSizes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('sizes could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((sizes: ContainerSizeType[]) => {
      this.containerSizes = sizes;
    });

    this.containerService.getAllContainerTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load container types')
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: ContainerType[]) => {
      this.containerTypes = types;
    })


    this.containerService.getAllContainers()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load containers')
      return e;
    }))
    .pipe(take(1))
    .subscribe((containers: Container[]) => {
      this.containers = containers;
    })


    this.containerService.getAllGrades()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load grades')
      return e;
    }))
    .pipe(take(1))
    .subscribe((grades: Grade[]) => {
      this.grades = grades;
    })

  }


  loadDocuments() {
    this.documentService.getDocumentsByEntityAndEntityId('smart-waste', this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load documents');
      return e;
    }))
    .subscribe((documents: Document[]) => {
      this.documents = documents;

      this.documents.forEach((document: any) => {
        this.loadImage(document.id);
      })
    })
  }

  loadImage(docId: number) {
    this.documentService.getImageById(docId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      return e;
    }))
    .subscribe((image: any) => {
      this.images.push(image);
    })
}

  loadSmartWaste() {
    this.jobService.getAllSmartWasteForJobId(this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load smart waste');
      return e;
    }))
    .subscribe((data: any) => {
      this.jobSmartWaste = data;
    })
  }
  loadPODS() {
    this.podService.getPodsByJobId(this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load pods');
      return e;
    }))
    .subscribe((pods: DriverJobMovement[]) => {
      this.pods = pods;
      let podAmount = 0;

      pods.forEach((pod: DriverJobMovement) => {
        podAmount += pod.qty;
      });

      if(podAmount > 0 && !this.job.jobManagerSignOff) {
        this.job.qty = podAmount;
      }

    })
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

      // Set tare weight

      // if(!this.job.tareWeight || this.job.tareWeight === 0 && this.job.jobAssignment.vehicle !== null) {
      //   this.job.tareWeight = this.job.jobAssignment.vehicle.tareWeight;
      // }

      // If it's not tipped or transport sign off
      if([1, 4].indexOf(this.job.jobSignOffStatusId) !== -1) {
        this.showAdditionalDetails = true;
      }

      this.loadOnSiteContainer();
      this.loadTippingPrice();
      this.loadPODS();
      this.loadSmartWaste();
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

  loadOnSiteContainer() {
    this.containerService.getContainerForSiteId(this.job.order.siteId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      return e;
    }))
    .subscribe((container: Container) => {
      this.job.containerOutId = container.id;
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

    //Save both order and job
    // if it's transport sign off we need to set the container in out
    if(this.job.jobSignOffStatusId === 4) {
      this.containerService.setTracking(JSON.parse(JSON.stringify(this.job)))
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not set location tracking for skips');
        return e;
      }))
      .subscribe((data) => {
        this.saveOrder();
      })

    }

    else {
      this.saveOrder();
    }

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
      this.router.navigateByUrl('/job-signoff');
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
