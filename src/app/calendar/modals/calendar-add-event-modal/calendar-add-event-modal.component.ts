import { Component, OnInit, Input } from '@angular/core';
import { CalendarEvent } from '../../models/calendar-event.model';
import { Calendar } from '../../models/calendar.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { CalendarEventService } from '../../services/calendar-event.service';
import { CalendarEventValidatorService } from '../../validators/calendar-event-validator.service';
import { take, catchError } from 'rxjs/operators';
import { CalendarStateService } from '../../services/calendar-state.service';

@Component({
  selector: 'app-calendar-add-event-modal',
  templateUrl: './calendar-add-event-modal.component.html',
  styleUrls: ['./calendar-add-event-modal.component.scss']
})
export class CalendarAddEventModalComponent implements OnInit {

  @Input()
  calendar: Calendar = new Calendar();

  isError: boolean = false;
  isServerError: boolean = false;
  
  calendarEvent: CalendarEvent = new CalendarEvent();
  constructor(private modalService: ModalService,
    private calendarEventValidatorService: CalendarEventValidatorService,
    private calendarStateService: CalendarStateService,
    private calendarEventService: CalendarEventService) { }

  ngOnInit(): void {
  }

  save() {
    this.isError = false;
    this.isServerError = false;
    if(!this.calendarEventValidatorService.isValid(this.calendarEvent)) {
      this.isError = true;
      return;
    }

    this.calendarEvent.calendarId = this.calendar.id;
    this.calendarEventService.createEvent(this.calendarEvent)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not create new event');
      return e;
    }))
    .subscribe((event: CalendarEvent) => {
      this.syncEvent(event);
    })
  }

  syncEvent(event: CalendarEvent) {
    this.calendarEventService.syncEvent(event.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not sync event');
      return e;
    }))
    .subscribe((data) => {
      this.calendarStateService.$eventAdded.next(event);
      window.location.reload();
      this.cancel();
    })
  }
  cancel() {
    this.calendarEvent = new CalendarEvent();
    this.modalService.close('calendarAddEventModal');
  }


}
