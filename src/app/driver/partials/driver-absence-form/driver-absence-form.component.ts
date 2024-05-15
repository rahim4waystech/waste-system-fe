import { Component, OnInit, Input } from '@angular/core';
import { DriverAbsence } from '../../models/driver-absence.model';
import { DriverAbsenceType } from '../../models/driver-absence-type.model';
import { Driver } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';
import { catchError, take } from 'rxjs/operators';
import { DriverAbsenceService } from '../../services/driver-absence.service';

@Component({
  selector: 'app-driver-absence-form',
  templateUrl: './driver-absence-form.component.html',
  styleUrls: ['./driver-absence-form.component.scss']
})
export class DriverAbsenceFormComponent implements OnInit {

  @Input()
  driverAbsence: DriverAbsence = new DriverAbsence();

  types: DriverAbsenceType[] = [];

  drivers: Driver[] = [];

  constructor(private driverService: DriverService,
    private driverAbsenceService: DriverAbsenceService) { }

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

    this.driverAbsenceService.getAllDriverAbsenceTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('drivers absence types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: DriverAbsenceType[]) => {
      this.types = types;
    });
  }

}
