import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver.model';
import { take, catchError } from 'rxjs/operators';
import { DriverHoursService } from '../../services/driver-hours.service';
import { DriverHours } from '../../models/driver-hours.model';
import { DriverAbsenceService } from '../../services/driver-absence.service';
import { DriverAbsence } from '../../models/driver-absence.model';

@Component({
  selector: 'app-driver-hours',
  templateUrl: './driver-hours.component.html',
  styleUrls: ['./driver-hours.component.scss']
})
export class DriverHoursComponent implements OnInit {


  drivers: Driver[] = [];

  currentDate: string = moment().format('YYYY-MM-DD');

  newDate: string = moment().format('YYYY-MM-DD');

  hours: DriverHours[] = [];

  absence: DriverAbsence[] = [];

  isError: boolean = false;
  isSuccess: boolean = false;

  constructor(private driverService: DriverService,
    private driverAbsenceService: DriverAbsenceService,
    private driverHoursService: DriverHoursService) { }

  ngOnInit(): void {

    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
     alert('Could not load in drivers. Please try again later.')
      return e;
    }))
    .subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });
    this.updateCurrentDate();
  }

  loadAbsence() {
    this.driverAbsenceService.getAbsenceByDate(this.currentDate)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isError = true;
      return e;
    }))
    .subscribe((data: DriverAbsence[]) => {
      this.absence = data;
    });
  }

  loadHours() {
    this.driverHoursService.getDriverHoursByDate(this.currentDate)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isError = false;
      return e;
    }))
    .subscribe((data: DriverHours[]) => {
      this.hours = data;
      this.setUpHourData();
    });
  }

  setUpHourData() {
    this.drivers.forEach((driver: Driver) => {
      const hasNoHourRecord = this.hours.filter(h => h.driverId === driver.id).length === 0;

      if(hasNoHourRecord) {
        const hourRecord = new DriverHours();
        hourRecord.driverId = driver.id;
        hourRecord.driver = driver;
        hourRecord.date = this.currentDate;
        this.hours.push(hourRecord);
      }
    });
  }

  updateCurrentDate(): void {
    this.currentDate = this.newDate;
    this.loadHours();
    this.loadAbsence();
  }

  updateTotalHours(driverHours: DriverHours): void {
    let isNextDayForEnd:boolean = driverHours.startTime > driverHours.endTime;

    const momentStart = moment("01-01-2020 " +  driverHours.startTime + ':00');
    const momentEnd = moment("01-01-2020 " +  driverHours.endTime + ':00');

    // Push forward a day
    if(isNextDayForEnd) {
      momentEnd.add("days", 1);
    }

    let duration = moment.duration(momentEnd.diff(momentStart));

    driverHours.chargeableHours = duration.asHours();

    let lunchBreakSupplied = driverHours.lunchBreak > 0;

    if(lunchBreakSupplied) {
      driverHours.chargeableHours -= driverHours.lunchBreak;
    }

  }

  onSaveClicked() {

    this.isError = false;
    this.isSuccess = false;

    // sep into two arrays one for new, one for update
    const newRecords = [];
    const updateRecords = [];

    this.hours.forEach((driverHours) => {
      if(driverHours.id === -1) {
        newRecords.push(driverHours);
      } else {
        updateRecords.push(driverHours);
      }
    });

    // two query one for new, one for update
    this.driverHoursService.bulkCreateOrUpdateDriverHours(this.hours)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isError = true;
      return e;
    }))
    .subscribe((data) => {
      this.loadHours();
      this.loadAbsence();
      this.isSuccess = true;
    })

  }

  getAbsenceByDriverId(driverId: number): DriverAbsence {
    if(!driverId) {
      throw new Error('You must provide a driver id for getAbsenceByDriverId');
    }

    const absenceRecord = this.absence.filter(a => a.driverId === driverId)[0];

    return !absenceRecord ? null : absenceRecord;
  }

  prevDay(): void {
    this.newDate = moment(this.newDate).subtract(1, 'days').format('YYYY-MM-DD');
    this.updateCurrentDate();
  }

  nextDay(): void {
    this.newDate = moment(this.newDate).add(1, 'days').format('YYYY-MM-DD');
    this.updateCurrentDate();
  }



}
