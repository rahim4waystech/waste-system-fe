import { Component, OnInit } from '@angular/core';
import { DriverAbsence } from '../../models/driver-absence.model';
import { ActivatedRoute } from '@angular/router';
import { DriverAbsenceValidatorService } from '../../validators/driver-absence-validator.service';
import { DriverAbsenceService } from '../../services/driver-absence.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-driver-absence-edit',
  templateUrl: './driver-absence-edit.component.html',
  styleUrls: ['./driver-absence-edit.component.scss']
})
export class DriverAbsenceEditComponent implements OnInit {


  driverAbsence: DriverAbsence = new DriverAbsence();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private driverAbsenceValidatorService: DriverAbsenceValidatorService,
    private driverAbsenceService: DriverAbsenceService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadDriverAbsence(+params['id']);
    })
  }

  loadDriverAbsence(id: number): void {
    this.driverAbsenceService.getDriverAbsenceById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((driverAbsence: DriverAbsence) => {
      this.driverAbsence = driverAbsence;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.driverAbsenceValidatorService.isValid(this.driverAbsence)) {
      // try to save it
      this.driverAbsenceService.updateDriverAbsence(this.driverAbsence)
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
