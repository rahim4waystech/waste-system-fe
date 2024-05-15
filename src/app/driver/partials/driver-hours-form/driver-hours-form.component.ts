import { Component, OnInit, Input } from '@angular/core';
import { DriverHours } from '../../models/driver-hours.model';
import { DriverService } from '../../services/driver.service';
import { catchError, take } from 'rxjs/operators';
import { Driver } from '../../models/driver.model';
import * as moment from 'moment';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-driver-hours-form',
  templateUrl: './driver-hours-form.component.html',
  styleUrls: ['./driver-hours-form.component.scss']
})
export class DriverHoursFormComponent implements OnInit {

  @Input()
  driverHours: DriverHours;

  drivers: Driver[] = [];

  constructor(private driverService: DriverService) { }

  ngOnInit(): void {
    this.driverService.getAllDrivers()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('drivers could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });
  }

  updateTotalHours(): void {
    let isNextDayForEnd:boolean = this.driverHours.startTime > this.driverHours.endTime;

    const momentStart = moment("01-01-2020 " +  this.driverHours.startTime + ':00');
    const momentEnd = moment("01-01-2020 " +  this.driverHours.endTime + ':00');

    // Push forward a day
    if(isNextDayForEnd) {
      momentEnd.add("days", 1);
    }

    let duration = moment.duration(momentEnd.diff(momentStart));

    this.driverHours.chargeableHours = duration.asHours();

    let lunchBreakSupplied = this.driverHours.lunchBreak > 0;

    if(lunchBreakSupplied) {
      this.driverHours.chargeableHours -= this.driverHours.lunchBreak;
    }

  }

}
