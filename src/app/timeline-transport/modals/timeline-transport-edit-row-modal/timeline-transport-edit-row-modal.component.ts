import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { RowValidatorService } from '../../validators/row-validator.service';
import { TimelineTransportStateService } from '../../services/timeline-transport-state.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { AccountService } from 'src/app/account/services/account.service';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { take, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Account } from 'src/app/order/models/account.model';
import { TimelineHistoryEventType, TimelineTransportHistoryService } from '../../services/timeline-transport-history.service';

@Component({
  selector: 'app-timeline-transport-edit-row-modal',
  templateUrl: './timeline-transport-edit-row-modal.component.html',
  styleUrls: ['./timeline-transport-edit-row-modal.component.scss']
})
export class TimelineTransportEditRowModalComponent implements OnInit,OnChanges {


  @Input()
  orderTypeId: number = environment.defaults.defaultTimeline;

  depots: Account[] = [];

  @Input()
  assignment: JobAssignment = new JobAssignment();

  // used to track old history for undo
  oldAssignment: JobAssignment = new JobAssignment();

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  trailers: Vehicle[] = [];

  isError: boolean = false;
  isServerError: boolean = false;

  vorAndAbsence: any = {vor: [], absence: []};

  roundOption: string = 'own';

  subcontractors: Subcontractor[] = [];

  canSave: boolean = false;

  constructor(private accountService: AccountService,
    private jobAssignmentService: JobAssignmentService,
    private rowValidatorService: RowValidatorService,
    private subcontractorService: SubcontractorService,
    private driverService: DriverService,
    private timelineTransportHistoryService: TimelineTransportHistoryService,
    private modalService: ModalService,
    private TimelineTransportStateService: TimelineTransportStateService,
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

    this.TimelineTransportStateService.$transportVorAndAbsenceChanged.subscribe((data) => {
      this.vorAndAbsence = data;
    })

    this.TimelineTransportStateService.$transportOrderTypeChanged.subscribe((orderTypeId) => {
      this.orderTypeId = orderTypeId;
    });
  }
  onOptionSelect($event, option) {
    this.roundOption = option;
  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.assignment !== undefined) {
      if(simple.assignment.currentValue.id !== -1) {
        // Load existing data
        this.loadDriversByDepotId(this.assignment.depotId);
        this.loadVehiclesByDepotId(this.assignment.depotId);

        this.roundOption = simple.assignment.currentValue.vehicleId !== -1 ? 'own' : 'sub';

        if(this.roundOption === "sub") {
          this.canSave = true;
        }

        this.oldAssignment = JSON.parse(JSON.stringify(simple.assignment.currentValue));
      }
    }
  }

  onDepotChanged($event) {
    this.assignment.depotId = +$event;
    this.assignment.depot.id = this.assignment.depotId;


    // Load vehicles and drivers based on depotId
    this.loadVehiclesByDepotId(this.assignment.depotId);
    this.loadDriversByDepotId(this.assignment.depotId);
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

      const hasVehicle = this.vehicles.filter(v => v.id === this.assignment.vehicleId).length > 0;

      // Fallback for non-active trucks
      if(!hasVehicle && this.assignment.vehicle !== null) {
        this.vehicles.push(this.assignment.vehicle);
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

      const hasDriver = this.drivers.filter(d => d.id === this.assignment.driverId).length > 0;

      // Fallback for non-active drivers
      if(!hasDriver && this.assignment.driver !== null) {
        this.drivers.push(this.assignment.driver);
      }

      this.drivers.unshift({id: -1, firstName: 'Select a driver', lastName: ''} as any);
      this.canSave = true;
    })
  }

  save() {
    this.isError = false;
    this.isServerError = false;

    if(!this.rowValidatorService.isDataValid(this.assignment, this.roundOption)) {
      this.isError = true;
      return;
    }

    this.assignment.driver = this.assignment.driver === null ? {id: -1} as Driver : this.assignment.driver;
    this.assignment.vehicle = this.assignment.vehicle === null ? {id: -1} as Vehicle : this.assignment.vehicle;
    this.assignment.subcontractor = this.assignment.subcontractor === null ? {id: -1} as Subcontractor : this.assignment.subcontractor;

    this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.editUnit, JSON.parse(JSON.stringify(this.oldAssignment)));

    this.jobAssignmentService.updateJobAssignment(this.assignment)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data: JobAssignment) => {

      if(this.drivers) {
        this.assignment.driver = this.drivers.filter(d => d.id === this.assignment.driverId)[0];
      }

      if(this.subcontractors) {
        this.assignment.subcontractor = this.subcontractors.filter(s => s.id === this.assignment.subcontractorId)[0];
      }

      if(this.vehicles) {
        this.assignment.vehicle = this.vehicles.filter(v => v.id === data.vehicleId)[0];
      }
      this.TimelineTransportStateService.$JobAssignmentChanged.next(this.assignment);

      this.cancel();
    });
  }

  reset() {
    this.assignment = new JobAssignment();
    this.isError = false;
    this.isServerError = false;
    this.vehicles = [];
    this.drivers = [];
  }

  cancel() {
    // this.reset();
    this.modalService.close('transportRowEditModal');
  }


}
