import { Component, OnInit } from '@angular/core';
import { DriverHours } from '../../models/driver-hours.model';
import { ActivatedRoute } from '@angular/router';
import { DriverHoursValidatorService } from '../../validators/driver-hours-validator.service';
import { DriverHoursService } from '../../services/driver-hours.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-driver-hours-edit',
  templateUrl: './driver-hours-edit.component.html',
  styleUrls: ['./driver-hours-edit.component.scss']
})
export class DriverHoursEditComponent implements OnInit {


  driverHours: DriverHours = new DriverHours();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private driverHoursValidatorService: DriverHoursValidatorService,
    private driverHoursService: DriverHoursService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadDriverHours(+params['id']);
    })
  }

  loadDriverHours(id: number): void {
    this.driverHoursService.getDriverHoursById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((driverHours: DriverHours) => {
      this.driverHours = driverHours;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.driverHoursValidatorService.isValid(this.driverHours)) {
      // try to save it
      this.driverHoursService.updateDriverHours(this.driverHours)
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
