import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from 'src/app/account/services/account.service';
import { take, catchError } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';
import { SkipRound } from '../../models/skip-round.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { SkipRoundService } from '../../services/skip-round.service';
import { SkipRoundValidatorService } from '../../validators/skip-round-validator.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SkipTimelineStateService } from '../../services/skip-timeline-state.service';
import { JobAssignment } from '../../models/job-assignment.model';
import { JobAssignmentService } from '../../services/job-assignment.service';
import * as moment from 'moment';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';

@Component({
  selector: 'app-skip-round-new-modal',
  templateUrl: './skip-round-new-modal.component.html',
  styleUrls: ['./skip-round-new-modal.component.scss']
})
export class SkipRoundNewModalComponent implements OnInit {

  @Input()
  date: string;

  depots: Account[] = [];

  round: SkipRound = new SkipRound();

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  subcontractors: Subcontractor[] = [];

  roundOption: string = 'own';

  vorAndAbsence: any = {vor: [], absence: []};

  isError: boolean = false;
  isServerError: boolean = false;
  constructor(private accountService: AccountService,
    private skipRoundService: SkipRoundService,
    private jobAssignmentService: JobAssignmentService,
    private skipRoundValidator: SkipRoundValidatorService,
    private driverService: DriverService,
    private subcontractorService: SubcontractorService,
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

    this.skipTimelineStateService.$skipDateChanged.subscribe((date) => {
      this.date = moment(date).format('YYYY-MM-DD');
    });

    this.skipTimelineStateService.$skipVorAndAbsenceChanged.subscribe((data) => {
      this.vorAndAbsence = data;
    })
  }

  onOptionSelect($event, option) {
    this.roundOption = option;
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

      const vorIds = this.vorAndAbsence.vor.map(v => v.vehicleId);
      this.vehicles = this.vehicles.filter(v => vorIds.indexOf(v.id) === -1);

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

    this.round.date = moment(this.date).format('YYYY-MM-DD');
    this.skipRoundService.createSkipRound(this.round)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data: SkipRound) => {
      this.skipTimelineStateService.$skipRoundAdded.next(data);

      const assignment = new JobAssignment();
      assignment.depot = data.depot;
      assignment.depotId = data.depotId;
      assignment.driver = data.driver;
      assignment.driverId = data.driverId;
      assignment.subcontractorId = data.subcontractorId;
      assignment.subcontractor.id = data.subcontractorId;
      assignment.driverStartTime = data.driverStartTime;
      assignment.skipRoundId = data.id;
      assignment.date = data.date;
      assignment.vehicle = data.vehicle;
      assignment.vehicleId = data.vehicleId;

      this.createJobAssignment(assignment);
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
    this.reset();
    this.modalService.close('skipRoundCreationModal');
  }

  createJobAssignment(jobAssignment: JobAssignment) {
    if(!jobAssignment) {
      throw new Error("Can't create job assignment without valid object in skip-round-new-modal");
    }

    this.jobAssignmentService.createJobAssignment(jobAssignment)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data: JobAssignment) => {
      this.skipTimelineStateService.$skipJobAssignmentAdded.next(data);
      this.cancel();
    });

  }
}
