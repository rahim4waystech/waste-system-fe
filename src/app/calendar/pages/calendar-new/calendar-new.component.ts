import { Component, OnInit } from '@angular/core';
import { Calendar } from '../../models/calendar.model';
import { CalendarValidatorService } from '../../validators/calendar-validator.service';
import { CalendarService } from '../../services/calendar.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-new',
  templateUrl: './calendar-new.component.html',
  styleUrls: ['./calendar-new.component.scss']
})
export class CalendarNewComponent implements OnInit {
  calendar: Calendar = new Calendar();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private calendarValidatorService: CalendarValidatorService,
    private calendarService: CalendarService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.calendarValidatorService.isValid(this.calendar)) {
      // try to save it
      this.calendarService.createCalendar(this.calendar)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/calendar';
      })
    } else {
      this.isError = true;
    }
  }
}
