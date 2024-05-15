import { Component, OnInit } from '@angular/core';
import { take, catchError } from 'rxjs/operators';
import { DriverHoursValidatorService } from 'src/app/driver/validators/driver-hours-validator.service';
import { FitterHours } from '../../models/fitter-hours.model';
import { FitterHourService } from '../../services/fitter-hour.service';
import { FitterHoursValidatorService } from '../../validators/fitter-hours-validator.service';

@Component({
  selector: 'app-fitter-hours-new',
  templateUrl: './fitter-hours-new.component.html',
  styleUrls: ['./fitter-hours-new.component.scss']
})
export class FitterHoursNewComponent implements OnInit {

  fitterHours: FitterHours = new FitterHours();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private fitterHoursValidatorService: FitterHoursValidatorService,
    private fitterHoursService: FitterHourService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fitterHoursValidatorService.isValid(this.fitterHours)) {
      // try to save it
      this.fitterHoursService.createFitterHours(this.fitterHours)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/4workshop/fitters/hours/advanced';
      })
    } else {
      this.isError = true;
    }
  }

}
