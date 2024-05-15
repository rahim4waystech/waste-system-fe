import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Account } from 'src/app/order/models/account.model';
import { Unit } from 'src/app/order/models/unit.model';
import { OrderService } from 'src/app/order/services/order.service';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { ArticRunDiaryStateService } from '../../services/artic-run-diary-state.service';
import { ArticRunDiaryService } from '../../services/artic-run-diary.service';

declare var $;


@Component({
  selector: 'app-artic-run-diary',
  templateUrl: './artic-run-diary.component.html',
  styleUrls: ['./artic-run-diary.component.scss']
})
export class ArticRunDiaryComponent implements OnInit {

  isDatePickerVisible: boolean = false;
  searchFilters:any = {} as any;
  newPage: number = 1;
  records: Job[] = [];

  currentJob: Job = new Job();
  accounts: Account[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  subcontractors: Subcontractor[] = [];
  tips: Account[] = [];
  units: Unit[] = [];
  trailers: Vehicle[] = [];

  selectedJobs: Job[] = [];

  
  constructor(public paginationService: PaginationService,
    private modalService: ModalService,
    private accountService: AccountService,
    private subcontractorService: SubcontractorService,
    private driverService: DriverService,
    private jobService: JobService,
    private vehicleService: VehicleService,
    private orderService: OrderService,
    private articRunDiaryStateService: ArticRunDiaryStateService,
    private articRunDiaryService: ArticRunDiaryService) { }

  ngOnInit(): void {

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    this.accountService.getAllAccountsForCustomerAndProspect()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load customers');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.accounts = accounts;
    });

    this.accountService.getAllTips()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load tips');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.tips = accounts;
    });

    this.subcontractorService.getAllSubcontractors()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load subbies');
      return e;
    }))
    .subscribe((subcontractors: Subcontractor[]) => {
      this.subcontractors = subcontractors;
    });

    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load subbies');
      return e;
    }))
    .subscribe((vehicles: any) => {
      this.vehicles = vehicles;
    });

    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load drivers');
      return e;
    }))
    .subscribe((drivers: any) => {
      this.drivers = drivers;
    });

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not load units');
      return e;
    }))
    .subscribe((units: any) => {
      this.units = units;
    })

    this.vehicleService.getAllVehiclesByType(7)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load trailers');
      return e;
    }))
    .subscribe((data: Vehicle[]) => {
      this.trailers = data;
      this.trailers.unshift({id: -1, registration: 'No trailer'} as any);
      this.trailers.unshift({id: 0, registration: '3rd Party/Subcontractor'} as any);
    })

    this.articRunDiaryStateService.$modalClosed.subscribe(() => {
      this.getRecords();
    })

    this.searchFilters['date'] = moment().format('YYYY-MM-DD');
    this.getRecords();
  }

  nextDay() {

  }

  prevDay() {

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
      this.getRecords();
    })

  }

  onCheckboxSelected($event) {
      // don't double up only add if not added already
   if($event.checked) {
    if(this.selectedJobs.filter(j => j.id === $event.record.id).length === 0) {
      this.selectedJobs.push(JSON.parse(JSON.stringify($event.record)));
    }
   } else {
     this.selectedJobs = this.selectedJobs.filter(j => j.id !== $event.record.id);
   }
  }

  isAnyJobsSignedOffOrInvoiced(jobs: Job[]) {
    return jobs.filter(j => j.jobStatusId > 3).length > 0;
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
      this.getRecords();
      // this.bulkUpdateOrders(ordersToUpdate);
    })

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
      this.getRecords();
    })

  }

  getRecords() {
    this.articRunDiaryService.getAllJobsForRunDiary(this.searchFilters, this.newPage, 10)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('Could not load jobs. Please try again later on');
      return e;

    }))
    .subscribe((records: any) => {
      this.records = records.data;

      this.records = this.articRunDiaryService.transformRecords(this.records);


      this.paginationService.setTotalRecords(records.total);
      this.paginationService.setPaginatedTotal(records.count);
    })
  }

  getFormattedDate() {
    return moment(this.searchFilters['date']).format('dddd MMMM Do YYYY');
  }

  isNextActive(): boolean {
    return this.paginationService.isNextActive();
  }

  isPrevActive(): boolean {
    return this.paginationService.isPrevActive();
  }


  onPaginationPageClicked(page: number) {

    if(<any>this.newPage === "") {
      return;
    }

    if(page > this.paginationService.getTotalPages() || page <= 0) {
      // alert('You must supply a valid page number');
      this.newPage = this.paginationService.getPage();
      return;
    }

    this.paginationService.setPage(page);
    this.newPage = page;
    this.getRecords();
  }

  getPagesArray(): number[] {
    const totalPages: number = this.paginationService.getTotalPages();

    const pagesArray: number[] = [];

    for(let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }

  openModal(modal: string) {
    this.modalService.open(modal);  
  }

  getCurrentPage(): number {
    return this.paginationService.getPage();
  }

  getUnitNameFromId(unitId:number=-1) {
    let unit: Unit = this.units.filter(u => u.id === unitId)[0];

    if(!unit) {
      return '';
    } else {
      return unit.name;
    }
  }


  getColorCodeForJob(job: Job) {
    let colorCode = '#636e72';

    if(job.jobSignOffStatusId === 4 || job.jobStatusId === 4) {
      colorCode = 'rgb(155, 89, 182)';
    }

    if(job.jobManagerSignOff) {
      colorCode = '#2980b9';
    }

    if(job.jobStatusId === 2) {
      colorCode = 'rgb(39, 174, 96)';
    }

    return colorCode;
  }


  isChecked(recordId: number) {
    const record:any = this.selectedJobs.filter(sr => sr.id === recordId)[0];

    return !record ? false : true;
  }


  onAllCheckboxClicked($event) {
    if($event.target.checked) {
          
      this.records.forEach((record: any) => {
        this.selectedJobs.push(record);
      });
      } else {
      this.selectedJobs = [];
      }
  }

}
