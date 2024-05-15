import { Component, OnInit } from '@angular/core';
import { DriverAbsence } from '../../models/driver-absence.model';
import { DriverAbsenceValidatorService } from '../../validators/driver-absence-validator.service';
import { DriverAbsenceService } from '../../services/driver-absence.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-driver-absence-new',
  templateUrl: './driver-absence-new.component.html',
  styleUrls: ['./driver-absence-new.component.scss']
})
export class DriverAbsenceNewComponent implements OnInit {

  driverAbsence: DriverAbsence = new DriverAbsence();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private driverAbsenceValidator: DriverAbsenceValidatorService,
    private driverAbsenceService: DriverAbsenceService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.driverAbsenceValidator.isValid(this.driverAbsence)) {
      // try to save it
      this.driverAbsenceService.createDriverAbsence(this.driverAbsence)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/drivers/absence';
      })
    } else {
      this.isError = true;
    }
  }

}
