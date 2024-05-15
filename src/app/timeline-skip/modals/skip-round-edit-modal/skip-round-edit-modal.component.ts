import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { SkipRound } from '../../models/skip-round.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { AccountService } from 'src/app/account/services/account.service';
import { SkipRoundService } from '../../services/skip-round.service';
import { SkipRoundValidatorService } from '../../validators/skip-round-validator.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SkipTimelineStateService } from '../../services/skip-timeline-state.service';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { take, catchError } from 'rxjs/operators';
import { JobAssignment } from '../../models/job-assignment.model';
import { JobAssignmentService } from '../../services/job-assignment.service';
import { Job } from '../../models/job.model';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';

import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-skip-round-edit-modal',
  templateUrl: './skip-round-edit-modal.component.html',
  styleUrls: ['./skip-round-edit-modal.component.scss']
})
export class SkipRoundEditModalComponent implements OnInit, OnChanges {


  depots: Account[] = [];

  @Input()
  round: SkipRound = new SkipRound();

  @Input()
  assignment: JobAssignment = new JobAssignment();

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  isError: boolean = false;
  isServerError: boolean = false;

  vorAndAbsence: any = {vor: [], absence: []};

  roundOption: string = 'own';

  subcontractors: Subcontractor[] = [];

  constructor(private accountService: AccountService,
    private skipRoundService: SkipRoundService,
    private jobAssignmentService: JobAssignmentService,
    private skipRoundValidator: SkipRoundValidatorService,
    private subcontractorService: SubcontractorService,
    private driverService: DriverService,
    private modalService: ModalService,
    private skipTimelineStateService: SkipTimelineStateService,
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

    this.skipTimelineStateService.$skipVorAndAbsenceChanged.subscribe((data) => {
      this.vorAndAbsence = data;
    })
  }
  onOptionSelect($event, option) {
    this.roundOption = option;
  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.round !== undefined) {
      if(simple.round.currentValue.id !== -1) {
        // Load existing data

        this.loadDriversByDepotId(this.round.depotId);
        this.loadVehiclesByDepotId(this.round.depotId);

        this.roundOption = simple.round.currentValue.vehicleId !== -1 ? 'own' : 'sub';
      }
    }
  }

  onDepotChanged($event) {
    this.round.depotId = +$event;
    this.round.depot.id = this.round.depotId;


    // Load vehicles and drivers based on depotId
    this.loadVehiclesByDepotId(this.round.depotId);
    this.loadDriversByDepotId(this.round.depotId);
  }

  loadVehiclesByDepotId(depotId: number) {
    this.vehicleService.getAllSkipVehiclesByDepot(depotId)
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

      const hasVehicle = this.vehicles.filter(v => v.id === this.round.vehicleId).length > 0;

      // Fallback for non-active trucks
      if(!hasVehicle) {
        this.vehicles.push(this.round.vehicle);
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

      const hasDriver = this.drivers.filter(d => d.id === this.round.driverId).length > 0;

      // Fallback for non-active drivers
      if(!hasDriver) {
        this.drivers.push(this.round.driver);
      }

      this.drivers.unshift({id: -1, firstName: 'Select a driver', lastName: ''} as any);
    })
  }

  save() {
    this.isError = false;
    this.isServerError = false;

    if(!this.skipRoundValidator.isDataValid(this.round, this.roundOption)) {
      this.isError = true;
      return;
    }

    this.round.driver = this.round.driver === null ? {id: -1} as Driver : this.round.driver;
    this.round.vehicle = this.round.vehicle === null ? {id: -1} as Vehicle : this.round.vehicle;
    this.round.subcontractor = this.round.subcontractor === null ? {id: -1} as Subcontractor : this.round.subcontractor;


    this.skipRoundService.updateSkipRound(this.round)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data: SkipRound) => {
      this.skipTimelineStateService.$skipRoundChanged.next(data);

      this.assignment.depot = data.depot;
      this.assignment.depotId = data.depotId;
      this.assignment.driver = data.driver === null ? {id: -1} as Driver : data.driver;
      this.assignment.driverId = data.driverId;
      this.assignment.driverStartTime = data.driverStartTime;
      this.assignment.skipRoundId = data.id;
      this.assignment.date = data.date;
      this.assignment.vehicle = data.vehicle === null ? {id: -1} as Vehicle : data.vehicle;
      this.assignment.vehicleId = data.vehicleId;
      this.assignment.subcontractor = data.subcontractor === null ? {id: -1} as Subcontractor : data.subcontractor;
      this.assignment.subcontractorId = data.subcontractorId;


      this.saveJobAssignment();
    })
  }

  saveJobAssignment() {
    this.jobAssignmentService.updateJobAssignment(this.assignment)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data: JobAssignment) => {
      this.skipTimelineStateService.$skipJobAssignmentChanged.next(this.assignment);
      this.cancel();
    })
  }

  reset() {
    this.round = new SkipRound();
    this.isError = false;
    this.isServerError = false;
    this.vehicles = [];
    this.drivers = [];
  }

  cancel() {
    // this.reset();
    this.modalService.close('skipRoundEditModal');
  }

}
