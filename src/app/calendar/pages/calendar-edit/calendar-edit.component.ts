import { Component, OnInit } from '@angular/core';
import { Calendar } from '../../models/calendar.model';
import { CalendarValidatorService } from '../../validators/calendar-validator.service';
import { CalendarService } from '../../services/calendar.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.scss']
})
export class CalendarEditComponent implements OnInit {

  calendar: Calendar = new Calendar();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private calendarValidator: CalendarValidatorService,
    private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadCalendar(+params['id']);
    })
  }

  loadCalendar(id: number): void {
    this.calendarService.getCalendarById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      this.isServerError = true;
      return e;
    }))
    .subscribe((calendar: Calendar) => {
      this.calendar = calendar;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.calendarValidator.isValid(this.calendar)) {
      // try to save it
      this.calendarService.updateCalendar(this.calendar)
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
