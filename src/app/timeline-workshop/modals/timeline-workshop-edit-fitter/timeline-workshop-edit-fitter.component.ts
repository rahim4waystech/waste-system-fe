import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Fitter } from 'src/app/fitter/models/fitter.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { DefectAssignment } from 'src/app/timeline-transport/models/defect-assignment.model';
import { FitterService } from 'src/app/fitter/services/fitter.service';
import { DefectAssignmentService } from '../../services/defect-assignment.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { TimelineWorkshopStateService } from '../../services/timeline-workshop-state.service';
import { DefectAssignmentValidatorService } from '../../validators/defect-assignment-validator.service';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { AccountService } from 'src/app/account/services/account.service';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-timeline-workshop-edit-fitter',
  templateUrl: './timeline-workshop-edit-fitter.component.html',
  styleUrls: ['./timeline-workshop-edit-fitter.component.scss']
})
export class TimelineWorkshopEditFitterComponent implements OnInit, OnChanges {
  isError: boolean = false;
  isServerError: boolean = false;

  fitters: Fitter[] = []
  depots: Account[] = [];
  subcontractors: Subcontractor[] = [];
  subcontractorDepots: Subcontractor[] = [];

  type: string = 'own';

  date: string = moment().format('YYYY-MM-DD');

  @Input()
  assignment: DefectAssignment = new DefectAssignment();

  constructor(private fitterService: FitterService,
    private defectAssignmentService: DefectAssignmentService,
    private modalService: ModalService,
    private timelineWorkshopStateService: TimelineWorkshopStateService,
    private defectAssignmentValidatorService: DefectAssignmentValidatorService,
    private subcontractorService: SubcontractorService,
    private accountService: AccountService) { }

  ngOnInit(): void {

    this.assignment.date = this.date;

    this.timelineWorkshopStateService.$dateUpdated.subscribe((date: Date) => {
      this.date = moment(date).format('YYYY-MM-DD');
    });

    this.fitterService.getAllFitters()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load fitters');
      return e;
    }))
    .subscribe((data: Fitter[]) => {
      this.fitters = data;
    })

    this.accountService.getAllDepots()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load depots');
      return e;
    }))
    .subscribe((data: Account[]) => {
      this.depots = data;
    })

    this.subcontractorService.getAllSubcontractors()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load subcontractors');
      return e;
    }))
    .subscribe((data: Subcontractor[]) => {
      this.subcontractors = data;
    })


  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.assignment) {
      if(simple.assignment.currentValue.id !== -1) {
        this.type = this.assignment.fitterId !== -1 ? 'own' : 'sub';
        this.assignment.subcontractor = {id: this.assignment.subcontractorId} as any;
        this.assignment.subcontractorDepot = {id: this.assignment.subcontractorDepotId} as any;
      }
    }
  }

  onOptionSelect($event, option) {
    this.type = option;
  }

  save() {
    this.isServerError = false;
    this.isError = false;

    if(!this.defectAssignmentValidatorService.isDataValid(this.assignment, this.type)) {
      this.isError = true;
      return;
    }

    this.assignment.date = this.date;
    this.defectAssignmentService.updateDefectAssignment(this.assignment)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      this.isServerError = true;
      return e;
    }))
    .subscribe((assignment: DefectAssignment) => {
      assignment.defects = this.assignment.defects;
      this.timelineWorkshopStateService.$assignmentUpdated.next(assignment);
      this.cancel();
    })
  }

  cancel() {
    // this.assignment = new DefectAssignment();
    this.modalService.close('workshopEditFitterModal');
  }

  onDepotChanged($event) {
    this.assignment.depotId = +$event.target.value;
    this.assignment.depot.id = this.assignment.depotId;
  }

  loadSubcontractorDepots() {
    this.subcontractorService.getAllSubcontractorsDepots(this.assignment.subcontractorId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load subcontractor depots');
      return e;
    }))
    .subscribe((depots: Subcontractor[]) => {
      this.subcontractorDepots = depots;
    })
  }

}
