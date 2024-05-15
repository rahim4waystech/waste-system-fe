import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Account } from 'src/app/order/models/account.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-artic-add-job-details',
  templateUrl: './artic-add-job-details.component.html',
  styleUrls: ['./artic-add-job-details.component.scss']
})
export class ArticAddJobDetailsComponent implements OnInit {
  isServerError: boolean = false;
  isError: boolean = false;
  isSuccess: boolean = false;

  job: Job = new Job();

  depots: Account[] = [];
  subcontractors: Subcontractor[] = [];
  vehicles: Vehicle[] = [];
  trailers: Vehicle[] = [];
  drivers: Driver[] = [];
  orderTypeId: number = 4;

  roundOption: string = 'own';


  vorAndAbsence:any = {absence: [], vor: []};


  constructor(private accountService: AccountService,
    private subcontractorService: SubcontractorService,
    private driverService: DriverService,
    private jobService: JobService,
    private jobAssignmentService: JobAssignmentService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.job.order = {id: +params['orderId']} as any;
      this.job.orderId = this.job.order.id;
      this.job.date = params['date'];
    });

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
      this.depots.unshift({id: -1, name: 'Select a depot'} as any);
    });


    this.subcontractorService.getAllSubcontractors()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('subcontractors could not be loaded');
      return e;
    }))
    .subscribe((data: Subcontractor[]) => {
      this.subcontractors = data;
      this.subcontractors.unshift({id: -1, name: 'Select a subcontractor'} as any);
    });

    // Trailers
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

    this.onDepotChanged(environment.defaults.defaultVehicleDepot);
  }

  onDepotChanged($event) {
    this.job.jobAssignment.depotId = +$event;
    this.job.jobAssignment.depot.id = this.job.jobAssignment.depotId;


    // Load vehicles and drivers based on depotId
    this.loadVehiclesByDepotId(this.job.jobAssignment.depotId);
    this.loadDriversByDepotId(this.job.jobAssignment.depotId);
  }

  loadVehiclesByDepotId(depotId: number) {
    const envHell = environment.timelineOptions;


    const vehicleMatch = envHell.filter(f=>f.value === this.orderTypeId)[0];

    this.vehicleService.getAllVehiclesByDepotAndVehicleTypeId(depotId,vehicleMatch.match)
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

      // Handle vor
      const vorIds = this.vorAndAbsence.vor.map(v => v.vehicleId);
      this.vehicles = this.vehicles.filter(v => vorIds.indexOf(v.id) === -1);

      const hasVehicle = this.vehicles.filter(v => v.id === this.job.jobAssignment.vehicleId).length > 0;

      // Fallback for non-active trucks
      if(!hasVehicle && this.job.jobAssignment.vehicle !== null) {
        this.vehicles.push(this.job.jobAssignment.vehicle);
      }

      this.vehicles.unshift({id: -1, registration: 'Select a vehicle'} as any);
    })
  }

  loadDriversByDepotId(depotId: number) {
    this.driverService.getAllDriversByDepot(depotId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot load vehicles for depot');
      return e;
    }))
    .subscribe((data: Driver[]) => {
      this.drivers = data;

      const absenceIds = this.vorAndAbsence.absence.map(d => d.driverId);
      this.drivers = this.drivers.filter(d => absenceIds.indexOf(d.id) === -1);

      const hasDriver = this.drivers.filter(d => d.id === this.job.jobAssignment.driverId).length > 0;

      // Fallback for non-active drivers
      if(!hasDriver && this.job.jobAssignment.driver !== null) {
        this.drivers.push(this.job.jobAssignment.driver);
      }

      this.drivers.unshift({id: -1, firstName: 'Select a driver', lastName: ''} as any);
    })
  }

  onOptionSelect($event, option) {
    this.roundOption = option;

    if(this.roundOption === 'own') {
       this.onDepotChanged(environment.defaults.defaultVehicleDepot);
    }
  }

  save() {
    this.jobAssignmentService.checkIfJobAssignmentExistsForDate(this.job.date, this.job.jobAssignment.driverId, this.job.jobAssignment.vehicleId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not perform check for existing job assignment');
      return e;
    }))
    .subscribe((data: any[]) => {
      if(data.length === 0) {
        // create new job assignment
        this.getNextSlotId();
      } else {
        this.job.jobAssignment = data[0];
        this.job.jobAssignmentId = this.job.jobAssignment.id;
        this.saveJob();
      }
    })
  }

  cancel() {
    window.location.href = '/artics/job/new/' + this.job.orderId;
  }


  getNextSlotId() {
    this.jobAssignmentService.getNextSlotId(this.job.date, this.orderTypeId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not get next slot id');
      return e;
    }))
    .subscribe((data: any) => {
      let slotId: number = data[0]['maxSlotId'];

      this.job.jobAssignment.slotNumber = slotId;


      if(!this.job.jobAssignment.slotNumber) {
        this.job.jobAssignment.slotNumber = 1;
      }

      this.saveJobAssignment();
    });
  }

  saveJobAssignment() {
    let jobAssignment: JobAssignment = this.job.jobAssignment;

    jobAssignment.driverStartTime = "07:00";
    jobAssignment.id = -1;
    jobAssignment.orderTypeId = this.orderTypeId;
    jobAssignment.skipRoundId = -1;


    let vehicle = this.vehicles.filter(v => v.id === this.job.jobAssignment.vehicleId)[0];

    if(vehicle) {
      jobAssignment.name = vehicle.registration;
    }

    this.jobAssignmentService.createJobAssignment(jobAssignment)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not create job assignment');
      return e;
    }))
    .subscribe((data: JobAssignment) => {
      this.job.jobAssignment = data;
      this.job.jobAssignmentId = this.job.jobAssignment.id;
      this.saveJob();
    })
  }

  saveJob() {

    this.job.jobStatusId = 1;
    this.job.jobStatus = {id: 1} as any;
    this.jobService.createJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not update job');
      return e;
    }))
    .subscribe((data) => {
      window.location.href = '/artics/job/new/' + this.job.orderId;
    })
  }

  

}
