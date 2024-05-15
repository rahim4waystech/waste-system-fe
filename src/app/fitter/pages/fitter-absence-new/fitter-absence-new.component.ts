import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { FitterAbsence } from '../../models/fitter-absence.model';
import { FitterAbsenceService } from '../../services/fitter-absence.service';
import { FitterAbsenceValidatorService } from '../../validators/fitter-absence-validator.service';

@Component({
  selector: 'app-fitter-absence-new',
  templateUrl: './fitter-absence-new.component.html',
  styleUrls: ['./fitter-absence-new.component.scss']
})
export class FitterAbsenceNewComponent implements OnInit {

  fitterAbsence: FitterAbsence = new FitterAbsence();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private fitterAbsenceValidator: FitterAbsenceValidatorService,
    private fitterAbsenceService: FitterAbsenceService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fitterAbsenceValidator.isValid(this.fitterAbsence)) {
      // try to save it
      this.fitterAbsenceService.createFitterAbsence(this.fitterAbsence)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/4workshop/fitters/absence';
      })
    } else {
      this.isError = true;
    }
  }

}
