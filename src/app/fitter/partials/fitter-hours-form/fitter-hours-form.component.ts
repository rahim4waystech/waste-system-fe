import { Component, OnInit,Input } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { FitterHours } from '../../models/fitter-hours.model';
import { Fitter } from '../../models/fitter.model';
import { FitterService } from '../../services/fitter.service';

@Component({
  selector: 'app-fitter-hours-form',
  templateUrl: './fitter-hours-form.component.html',
  styleUrls: ['./fitter-hours-form.component.scss']
})
export class FitterHoursFormComponent implements OnInit {

  @Input()
  fitterHours = new FitterHours();

  fitters: Fitter[] = [];
  constructor(private fitterService: FitterService) { }

  ngOnInit(): void {
    this.fitterService.getAllFitters()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('fitters could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((fitters: Fitter[]) => {
      this.fitters = fitters;
    });
  }

  updateTotalHours(): void {
    let isNextDayForEnd:boolean = this.fitterHours.startTime > this.fitterHours.endTime;

    const momentStart = moment("01-01-2020 " +  this.fitterHours.startTime + ':00');
    const momentEnd = moment("01-01-2020 " +  this.fitterHours.endTime + ':00');

    // Push forward a day
    if(isNextDayForEnd) {
      momentEnd.add("days", 1);
    }

    let duration = moment.duration(momentEnd.diff(momentStart));

    this.fitterHours.chargeableHours = duration.asHours();

    let lunchBreakSupplied = this.fitterHours.lunchBreak > 0;

    if(lunchBreakSupplied) {
      this.fitterHours.chargeableHours -= this.fitterHours.lunchBreak;
    }

  }

}
