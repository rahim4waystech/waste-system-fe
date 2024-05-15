import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, catchError } from 'rxjs/operators';
import { DriverAbsence } from 'src/app/driver/models/driver-absence.model';
import { FitterAbsence } from '../../models/fitter-absence.model';
import { FitterAbsenceService } from '../../services/fitter-absence.service';
import { FitterAbsenceValidatorService } from '../../validators/fitter-absence-validator.service';

@Component({
  selector: 'app-fitter-absence-edit',
  templateUrl: './fitter-absence-edit.component.html',
  styleUrls: ['./fitter-absence-edit.component.scss']
})
export class FitterAbsenceEditComponent implements OnInit {

  fitterAbsence: FitterAbsence = new FitterAbsence();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private fitterAbsenceValidatorService: FitterAbsenceValidatorService,
    private fitterAbsenceService: FitterAbsenceService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadFitterAbsence(+params['id']);
    })
  }

  loadFitterAbsence(id: number): void {
    this.fitterAbsenceService.getFitterAbsenceById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((fitterAbsence: FitterAbsence) => {
      this.fitterAbsence = fitterAbsence;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fitterAbsenceValidatorService.isValid(this.fitterAbsence)) {
      // try to save it
      this.fitterAbsenceService.updateFitterAbsence(this.fitterAbsence)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        this.isSuccess = true;
      })
    } else {
      this.isError = true;
    }
  }

}
