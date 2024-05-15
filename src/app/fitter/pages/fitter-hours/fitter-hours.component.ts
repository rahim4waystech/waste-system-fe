import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { FitterHours } from '../../models/fitter-hours.model';
import { Fitter } from '../../models/fitter.model';
import { FitterHourService } from '../../services/fitter-hour.service';
import { FitterService } from '../../services/fitter.service';

@Component({
  selector: 'app-fitter-hours',
  templateUrl: './fitter-hours.component.html',
  styleUrls: ['./fitter-hours.component.scss']
})
export class FitterHoursComponent implements OnInit {

  fitters: Fitter[] = [];

  currentDate: string = moment().format('YYYY-MM-DD');

  newDate: string = moment().format('YYYY-MM-DD');

  hours: FitterHours[] = [];

  isError: boolean = false;
  isSuccess: boolean = false;

  constructor(private fitterService: FitterService,
    private fitterHoursService: FitterHourService) { }

  ngOnInit(): void {

    this.fitterService.getAllFitters()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
     alert('Could not load in fitters. Please try again later.')
      return e;
    }))
    .subscribe((fitters: Fitter[]) => {
      this.fitters = fitters;
    });
    this.updateCurrentDate();
  }

  loadHours() {
    this.fitterHoursService.getFitterHoursByDate(this.currentDate)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isError = false;
      return e;
    }))
    .subscribe((data: FitterHours[]) => {
      this.hours = data;
      this.setUpHourData();
    });
  }

  setUpHourData() {
    this.fitters.forEach((fitter: Fitter) => {
      const hasNoHourRecord = this.hours.filter(h => h.fitterId === fitter.id).length === 0;

      if(hasNoHourRecord) {
        const hourRecord = new FitterHours();
        hourRecord.fitterId = fitter.id;
        hourRecord.fitter = fitter;
        hourRecord.date = this.currentDate;
        this.hours.push(hourRecord);
      }
    });
  }

  updateCurrentDate(): void {
    this.currentDate = this.newDate;
    this.loadHours();
  }

  updateTotalHours(fitterHours: FitterHours): void {
    let isNextDayForEnd:boolean = fitterHours.startTime > fitterHours.endTime;

    const momentStart = moment("01-01-2020 " +  fitterHours.startTime + ':00');
    const momentEnd = moment("01-01-2020 " +  fitterHours.endTime + ':00');

    // Push forward a day
    if(isNextDayForEnd) {
      momentEnd.add("days", 1);
    }

    let duration = moment.duration(momentEnd.diff(momentStart));

    fitterHours.chargeableHours = duration.asHours();

    let lunchBreakSupplied = fitterHours.lunchBreak > 0;

    if(lunchBreakSupplied) {
      fitterHours.chargeableHours -= fitterHours.lunchBreak;
    }

  }

  onSaveClicked() {

    this.isError = false;
    this.isSuccess = false;

    // sep into two arrays one for new, one for update
    const newRecords = [];
    const updateRecords = [];

    this.hours.forEach((fitterHours) => {
      if(fitterHours.id === -1) {
        newRecords.push(fitterHours);
      } else {
        updateRecords.push(fitterHours);
      }
    });

    // two query one for new, one for update
    this.fitterHoursService.bulkCreateOrUpdateFitterHours(this.hours)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isError = true;
      return e;
    }))
    .subscribe((data) => {
      this.loadHours();
      this.isSuccess = true;
    })

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
