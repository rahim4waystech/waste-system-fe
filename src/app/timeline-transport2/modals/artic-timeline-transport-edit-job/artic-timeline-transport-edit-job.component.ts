import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { catchError, take } from 'rxjs/operators';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';
import { AddJobValidatorService } from 'src/app/timeline-transport/validators/add-job-validator.service';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Driver } from 'src/app/driver/models/driver.model';

@Component({
  selector: 'app-artic-timeline-transport-edit-job',
  templateUrl: './artic-timeline-transport-edit-job.component.html',
  styleUrls: ['./artic-timeline-transport-edit-job.component.scss']
})
export class ArticTimelineTransportEditJobComponent implements OnInit {

  selectedJobs: Job[] = [];
  qty: number = -1;
  time: string = '';
  isError: boolean = false;
  isServerError: boolean = false;
  split:boolean = false;
  collectionVehicleId: number = -1;
  collectionDriverId: number = -1;
  deliveryVehicleId: number =- -1;
  deliveryDriverId: number = -1;
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];


  constructor(private timelineTransportStateService: TimelineTransportStateService,
    private modalService: ModalService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private jobService: JobService,
    private addJobValidatorService: AddJobValidatorService) { }

  ngOnInit(): void {
    this.isError = false;
    this.timelineTransportStateService.$transportSelectedJobsChanged.subscribe((jobs: Job[]) => {
      this.selectedJobs = jobs;
    })

    this.loadDrivers();
    this.loadVehicles();
  }
  save() {

    this.isError = false;
    if(!this.addJobValidatorService.isValid({ qty: this.qty, time: 'na'} as any)) {
      this.isError = true;
      return;
    }

    this.selectedJobs.forEach((job: Job) => {
      job.qty = this.qty;
      job.collectionDriverId = this.collectionDriverId;
      job.collectionVehicleId = this.collectionVehicleId;
      job.deliveryDriverId = this.deliveryDriverId;
      job.deliveryVehicleId = this.deliveryVehicleId;
      // job.time = this.time;
    });

    this.jobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update jobs please try again later');
      return e;
    }))
    .subscribe(() => {
      this.timelineTransportStateService.$transportSelectedJobsChanged.next([]);
      this.cancel();
    })

  }

  cancel() {
    this.modalService.close('ArtictransportJobEditModal');
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
}