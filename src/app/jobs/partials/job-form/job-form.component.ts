import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { OrderService } from 'src/app/order/services/order.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { AccountService } from 'src/app/account/services/account.service';
import { Router } from '@angular/router';
import { OrderValidatorService } from 'src/app/order/validators/order-validator.service';
import { ContainerService } from 'src/app/container/services/container.service';
import { catchError, take } from 'rxjs/operators';
import { OrderType } from 'src/app/order/models/order-type.model';
import { SkipOrderType } from 'src/app/order/models/skip-order-type.model';
import { ContainerSizeType } from 'src/app/container/models/container-size-type.model';
import { ContainerType } from 'src/app/container/models/container-type.model';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Grade } from 'src/app/container/models/grade.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit, OnChanges {

  @Input()
  job: Job = new Job();

    types: OrderType[] = [];
  skipOrderTypes: SkipOrderType[] = [];
  containerSizes: ContainerSizeType[] = [];
  containerTypes: ContainerType[] = [];
  grades: Grade[] = [];
  tips: Account[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];

  containers: Container[] = [];
  subcontractors: Subcontractor[] = [];

  vehicleOption = 'own';

  constructor(private jobService: JobService,
    private orderService: OrderService,
    private modalService: ModalService,
    private driverService: DriverService,
    private accountService: AccountService,
    private vehicleService: VehicleService,
    private router: Router,
    private subcontractorService: SubcontractorService,
    private orderValidator: OrderValidatorService,
    private containerService: ContainerService,) {
  }

  ngOnInit(): void {
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


    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load drivers');
      return e;
    }))
    .subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });


    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load vehicles');
      return e;
    }))
    .subscribe((vehicles: Vehicle[]) => {
      this.vehicles = vehicles;
    });


    this.subcontractorService.getAllSubcontractors()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load subcontractors');
      return e;
    }))
    .subscribe((subcontractors: Subcontractor[]) => {
      this.subcontractors = subcontractors;
    });
  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.job) {
      if(simple.job.currentValue.id !== -1) {
        this.vehicleOption = simple.job.currentValue.jobAssignment.subcontractorId !== -1 ? 'sub'  : 'own';
      }
     }
  }

  openCustomerModal() {
    this.modalService.open('jobEditSelectCustomerModal');
  }

  updateDepot() {
    const vehicle = this.vehicles.filter(v => v.id === this.job.jobAssignment.vehicleId)[0];

    if(vehicle) {
      this.job.jobAssignment.depotId = vehicle.depotId;
      this.job.jobAssignment.depot.id = vehicle.depotId;
    }
  }

  onOptionSelect($event, option: string) {
    this.vehicleOption = option;

    if(option === 'sub') {
      this.job.jobAssignment.vehicleId = -1;
      this.job.jobAssignment.driverId = -1;
    } else {
      this.job.jobAssignment.subcontractorId = -1;
    }
  }

}
