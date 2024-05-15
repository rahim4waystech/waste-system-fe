import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { SkipRound } from 'src/app/timeline-skip/models/skip-round.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { AccountService } from 'src/app/account/services/account.service';
import { SkipRoundService } from 'src/app/timeline-skip/services/skip-round.service';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { SkipRoundValidatorService } from 'src/app/timeline-skip/validators/skip-round-validator.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SkipTimelineStateService } from 'src/app/timeline-skip/services/skip-timeline-state.service';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { take, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';

import { environment } from 'src/environments/environment';
import { Account } from 'src/app/order/models/account.model';
import { TimelineTransportHistoryService, TimelineHistoryEventType } from 'src/app/timeline-transport/services/timeline-transport-history.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';
import { RowValidatorService } from 'src/app/timeline-transport/validators/row-validator.service';
import { ArticRowValidatorService } from '../../validators/artic-row-validator.service';

@Component({
  selector: 'app-artic-timeline-transport-add-row-modal',
  templateUrl: './artic-timeline-transport-add-row-modal.component.html',
  styleUrls: ['./artic-timeline-transport-add-row-modal.component.scss']
})
export class ArticTimelineTransportAddRowModalComponent implements OnInit {

  @Input()
  date: string;

  qty = 1;


  @Input()
  orderTypeId: number = 4;

  depots: Account[] = [];

  jobAssignment: JobAssignment = new JobAssignment();

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  trailers: Vehicle[] = [];
  artics: Vehicle[] = [];


  subcontractors: Subcontractor[] = [];

  roundOption: string = 'own';

  vorAndAbsence: any = {vor: [], absence: []};

  isError: boolean = false;
  isServerError: boolean = false;
  constructor(private accountService: AccountService,
    private jobAssignmentService: JobAssignmentService,
    private driverService: DriverService,
    private timelineTransportHistoryService: TimelineTransportHistoryService,
    private subcontractorService: SubcontractorService,
    private modalService: ModalService,
    private rowValidatorService: ArticRowValidatorService,
    private timelineTransportStateService: TimelineTransportStateService,
    private vehicleService: VehicleService) { }


  ngOnInit(): void {
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
      this.trailers.unshift({id: -1, registration: '3rd Party/Subcontractor'} as any);
    })


      // Artics
      this.vehicleService.getAllVehiclesByType(6)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('could not load trailers');
        return e;
      }))
      .subscribe((data: Vehicle[]) => {
        this.artics = data;
        this.artics.unshift({id: -1, registration: 'No artics'} as any);
        this.artics.unshift({id: -1, registration: '3rd Party/Subcontractor'} as any);
      })


    this.timelineTransportStateService.$transportDateChanged.subscribe((date) => {
      this.date = moment(date).format('YYYY-MM-DD');
    });

    this.timelineTransportStateService.$transportOrderTypeChanged.subscribe((orderTypeId) => {
      this.orderTypeId = orderTypeId;
    });

    this.timelineTransportStateService.$transportVorAndAbsenceChanged.subscribe((data) => {
      this.vorAndAbsence = data;
    })

    // if first go 
    this.jobAssignment.driverStartTime = '07:00';

    this.onDepotChanged(environment.defaults.defaultVehicleDepot);
  }


  onOptionSelect($event, option) {
    this.roundOption = option;

    if(this.roundOption === 'own') {
      this.onDepotChanged(environment.defaults.defaultVehicleDepot);
    }
  }

  onDepotChanged($event) {
    this.jobAssignment.depotId = +$event;
    this.jobAssignment.depot.id = this.jobAssignment.depotId;


    // Load vehicles and drivers based on depotId
    this.loadVehiclesByDepotId(this.jobAssignment.depotId);
    this.loadDriversByDepotId(this.jobAssignment.depotId);
  }

  loadVehiclesByDepotId(depotId: number) {
    const envHell = environment.timelineOptions;


    const vehicleMatch = envHell.filter(f=>f.value === this.orderTypeId)[0];

//    this.vehicleService.getAllVehiclesByDepotAndVehicleTypeId(depotId,vehicleMatch.match)

this.vehicleService.getAllPaginatedTrailers(100,1,7)  
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot load vehicles for depot');
      return e;
    }))
    .subscribe((data: any) => {
      this.vehicles = data.data;
      if(this.vehicles){
        const vorIds = this.vorAndAbsence.vor.map(v => v.vehicleId);
        if(vorIds.length > 0){
          this.vehicles = this.vehicles.filter(v => vorIds.indexOf(v.id) === -1);
          
        }
        this.vehicles.unshift({id: -1, registration: 'Select a vehicle'} as any);

      }
      

    })
  }

  loadDriversByDepotId(depotId: number) {
    this.driverService.getAllDriversByDepot(depotId)
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

      const absenceIds = this.vorAndAbsence.absence.map(d => d.driverId);
      this.drivers = this.drivers.filter(d => absenceIds.indexOf(d.id) === -1);
      this.drivers.unshift({id: -1, firstName: 'Select a driver', lastName: ''} as any);
    })
  }

  save() {
    this.isError = false;
    this.isServerError = false;

    if(!this.rowValidatorService.isDataValid(this.jobAssignment, this.roundOption)) {
      this.isError = true;
      return;
    }

    this.jobAssignment.date = moment(this.date).format('YYYY-MM-DD');
    this.createJobAssignment(this.jobAssignment);
  }


  setNameFromSub() {
    const sub = this.subcontractors.filter(s => s.id === this.jobAssignment.subcontractorId)[0];

    if(sub) {
      this.jobAssignment.name = sub.name;
    }
  }
  updateNameFromVehicle() {
    const vehicle = this.vehicles.filter(v => v.id === this.jobAssignment.trailerId)[0];

    if(vehicle) {
      this.jobAssignment.name = vehicle.registration;
    }
  }
  reset() {
    this.jobAssignment = new JobAssignment();
    this.qty = 1;
    this.jobAssignment.driverStartTime = "07:00";
    this.isError = false;
    this.isServerError = false;
    this.vehicles = [];
    this.drivers = [];

    this.onDepotChanged(environment.defaults.defaultVehicleDepot);
  }

  cancel() {
    //this.reset();
    this.modalService.close('ArtictransportRowCreationModal');
  }

  createJobAssignment(jobAssignment: JobAssignment) {

    
    if(!jobAssignment) {
      throw new Error("Can't create job assignment without valid object in new row on transport timeline");
    }

    jobAssignment.orderTypeId = this.orderTypeId;

    const objects = [];

    for(let i = 0; i < this.qty; i++) {

      if(this.jobAssignment.subcontractorId > -1) {
        const ja = JSON.parse(JSON.stringify(this.jobAssignment));
        ja.name = ja.name + ' ' + (i + 1);
        objects.push(ja);

      }
      else {
        objects.push(JSON.parse(JSON.stringify(this.jobAssignment)));
      }
    }


    this.jobAssignmentService.bulkCreateJobAssignment2(objects)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data: any) => {
      data.forEach((item) => {
        item.driver = this.drivers.filter(d => d.id === item.driverId)[0];
        item.subcontractor = this.subcontractors.filter(s => s.id === item.subcontractorId)[0];
        item.vehicle = this.vehicles.filter(v => v.id === item.vehicleId)[0];
  
        this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.addUnit, item);
        this.timelineTransportStateService.$transportJobAssignmentAdded.next(item);  
        this.cancel();
      });
    });

  }

}
