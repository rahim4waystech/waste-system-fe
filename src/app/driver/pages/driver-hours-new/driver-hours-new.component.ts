import { Component, OnInit } from '@angular/core';
import { DriverHours } from '../../models/driver-hours.model';
import { DriverHoursValidatorService } from '../../validators/driver-hours-validator.service';
import { DriverHoursService } from '../../services/driver-hours.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-driver-hours-new',
  templateUrl: './driver-hours-new.component.html',
  styleUrls: ['./driver-hours-new.component.scss']
})
export class DriverHoursNewComponent implements OnInit {

  driverHours: DriverHours = new DriverHours();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private driverHoursValidator: DriverHoursValidatorService,
    private driverHoursService: DriverHoursService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.driverHoursValidator.isValid(this.driverHours)) {
      // try to save it
      this.driverHoursService.createDriverHours(this.driverHours)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/drivers/hours/advance';
      })
    } else {
      this.isError = true;
    }
  }

}
