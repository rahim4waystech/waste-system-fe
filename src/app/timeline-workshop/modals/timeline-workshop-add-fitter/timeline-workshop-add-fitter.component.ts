import { Component, OnInit } from '@angular/core';
import { Fitter } from 'src/app/fitter/models/fitter.model';
import { Account } from 'src/app/order/models/account.model';
import { FitterService } from 'src/app/fitter/services/fitter.service';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { DefectAssignment } from 'src/app/timeline-transport/models/defect-assignment.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { DefectAssignmentService } from '../../services/defect-assignment.service';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { DefectAssignmentValidatorService } from '../../validators/defect-assignment-validator.service';
import { TimelineWorkshopStateService } from '../../services/timeline-workshop-state.service';
import * as moment from 'moment';

@Component({
  selector: 'app-timeline-workshop-add-fitter',
  templateUrl: './timeline-workshop-add-fitter.component.html',
  styleUrls: ['./timeline-workshop-add-fitter.component.scss']
})
export class TimelineWorkshopAddFitterComponent implements OnInit {

  isError: boolean = false;
  isServerError: boolean = false;

  fitters: Fitter[] = []
  depots: Account[] = [];
  subcontractors: Subcontractor[] = [];
  subcontractorDepots: Subcontractor[] = [];

  type: string = 'own';

  date: string = moment().format('YYYY-MM-DD');

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
    this.defectAssignmentService.createDefectAssignment(this.assignment)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((assignment: DefectAssignment) => {
      this.timelineWorkshopStateService.$assignmentAdded.next(assignment);
      this.cancel();
    })
  }

  cancel() {
    this.assignment = new DefectAssignment();
    this.modalService.close('workshopAddFitterModal');
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
