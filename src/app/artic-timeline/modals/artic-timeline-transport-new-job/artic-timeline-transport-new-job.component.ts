import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { OrderService } from 'src/app/order/services/order.service';
import { take, catchError } from 'rxjs/operators';
import { Unit } from 'src/app/order/models/unit.model';
import { Order } from 'src/app/order/models/order.model';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';
import { AddJobValidatorService } from 'src/app/timeline-transport/validators/add-job-validator.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { environment } from 'src/environments/environment';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { ArticRowValidatorService } from '../../validators/artic-row-validator.service';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-artic-timeline-transport-new-job',
  templateUrl: './artic-timeline-transport-new-job.component.html',
  styleUrls: ['./artic-timeline-transport-new-job.component.scss']
})
export class ArticTimelineTransportNewJobComponent implements OnInit, OnChanges {

  isError: boolean = false;
  isServerError: boolean = false;
  depots: Account[] = [];
  units: Unit[] = [];
  split:boolean = false;
  vehicles: Vehicle[] = [];
  ArticVehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  jobAssignment: JobAssignment = new JobAssignment();
  selectedassignment: number = -1;
  @Input()
  job: Job = new Job();
  job2: Job = new Job();
  constructor(private accountService: AccountService,
    private modalService: ModalService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private orderService: OrderService,
    private addJobValidatorService: AddJobValidatorService,
    private timelineTransportStateService: TimelineTransportStateService,
    private jobService: JobService,
    private jobAssignments: JobAssignmentService,
    private rowValidatorService: ArticRowValidatorService) { }

  ngOnInit(): void {; 
    this.isError = false;

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load untis');
      return e;
    }))
    .subscribe((units: any) => {
      this.units = units;
    });
    this.loadDepot();
    this.loadDrivers();
    this.loadVehicles();
  }


  loadDepot(){
    this.accountService.getAllDepots()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Depots could not be loaded');
      return e;
    }))
    .subscribe((data: Account[]) => {
      this.depots = data;
      this.depots.unshift({name: 'Select a depot', id:-1} as any);
    });
  }

  loadVehicles() {  


    this.vehicleService.getAllVehiclesByType(6)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot load vehicles for depot');
      return e;
    }))
    .subscribe((data: Vehicle[]) => {
      
      this.ArticVehicles = data;
      this.ArticVehicles.unshift({id: -1, registration: 'Select a vehicle'} as any);

    });
    this.vehicleService.getAllVehiclesByType(7)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot load vehicles for depot');
      return e;
    }))
    .subscribe((data: Vehicle[]) => {
      
      this.vehicles = data;
    //   const vorIds = this.vorAndAbsence.vor.map(v => v.vehicleId);
    //  this.vehicles = this.vehicles.filter(v => vorIds.indexOf(v.id) === -1);
      this.vehicles.unshift({id: -1, registration: 'Select a vehicle'} as any);
    })
  }

  loadDrivers() {

    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot load drivers for depot');
      return e;
    }))
    .subscribe((data: Driver[]) => {
      this.drivers = data;

//        const absenceIds = this.vorAndAbsence.absence.map(d => d.driverId);
  //    this.drivers = this.drivers.filter(d => absenceIds.indexOf(d.id) === -1);
      this.drivers.unshift({id: -1, firstName: 'Select a driver', lastName: ''} as any);
    })
  }  

  ngOnChanges(simple: SimpleChanges) {
    // if(simple.job) {
    //   if(simple.job.currentValue.time === "") {
    //     this.job.time = "07:30";
    //   }
    // }
  }

  getUnitForJob() {


    const job: any = this.job;

    if(!this.job.order['orderLines']) {
      return 'N/A';
    } 

    let orderLine = job.order?.orderLines.filter(ol => ol.isPrimaryCharge)[0];

    if(!orderLine) {
      orderLine = job.order.orderLines[0];
    }

    
    const unit = this.units.filter(u => u.id === orderLine.quoteLine?.product.unitId)[0];
  
    if(unit) {
      return unit.name;
    } else {
      // must be quick item
      const unitpl = this.units.filter(u => u.id === orderLine.unitId)[0];

      if(!unitpl) {
        return 'N/A';
      }

      return unitpl.name;
    }

  }
  
  updateNameFromVehicle() {
    const vehicle = this.vehicles.filter(v => v.id === this.jobAssignment.trailerId)[0];

    if(vehicle) {
      this.jobAssignment.name = vehicle.registration;
    }
  }

  save() {

    this.isError = false;

    if(!this.addJobValidatorService.isValid(this.job)) {
      this.isError = true;
      return;
    }


    this.job2 = Object.assign({},this.job);
    
    this.jobAssignment.orderTypeId = 4;
    this.jobAssignment.depot = this.depots.filter((x) => {return x.id == this.job.jobAssignment.depotId})[0];
    this.jobAssignment.depotId = this.jobAssignment.depot.id;
    // this.jobAssignment.name = this.jobAssignment.vehicle.name;
    if(this.split){

    if(!this.rowValidatorService.isDataValid(this.jobAssignment, 'own')) {
      this.isError = true;
      return;
    }
  }
    this.timelineTransportStateService.$transportNewJobDialogClosed.next(this.job);
    if(this.split){

      this.jobAssignments.createJobAssignment(this.jobAssignment).subscribe((data: JobAssignment)=>{
        this.job2.orderId = this.job.orderId;
        this.job2.deliveryDriverId = this.job.collectionDriverId;
        this.job2.deliveryVehicleId = this.job.collectionVehicleId;
        this.job2.date = this.jobAssignment.date;
        this.job2.collectionOrder = 1;
        this.job2.jobAssignment = data;
        this.job2.jobAssignmentId = data.id;
      
         this.jobService.createJob(this.job2).subscribe((e)=> {});
      
      });
    }
    this.orderService.UpdateOrderProvisionAllocation({provissionId : this.job.order['ProvissionId'],orderId: this.job.order.id}).subscribe();
    this.cancel();
  }
  reset() {
    this.isError = false;
    this.isServerError = false;
    this.depots = [];
    this.units = [];
    this.split = false;
    this.vehicles = [];
    this.ArticVehicles = [];
    this.drivers = [];
    this.jobAssignment = new JobAssignment();
    this.selectedassignment = -1;
    this.job = new Job();
    this.job2 = new Job();
  }
  cancel() {
    this.modalService.close('ArtictransportJobCreationModal');
    this.reset();
  }
  
}
