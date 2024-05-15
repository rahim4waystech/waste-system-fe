import { Component, OnInit, Input } from '@angular/core';
import { Calendar } from '../../models/calendar.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { CalendarEventValidatorService } from '../../validators/calendar-event-validator.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CalendarEventService } from '../../services/calendar-event.service';
import { take, catchError } from 'rxjs/operators';
import { CalendarEvent } from '../../models/calendar-event.model';

@Component({
  selector: 'app-calendar-edit-event-modal',
  templateUrl: './calendar-edit-event-modal.component.html',
  styleUrls: ['./calendar-edit-event-modal.component.scss']
})
export class CalendarEditEventModalComponent implements OnInit {

  @Input()
  calendar: Calendar = new Calendar();

  isError: boolean = false;
  isServerError: boolean = false;
  
  @Input()
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
    this.calendarEventService.updateEvent(this.calendarEvent)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not update new event');
      return e;
    }))
    .subscribe((event: CalendarEvent) => {
      this.calendarStateService.$eventAdded.next(event);
      window.location.reload();
      this.cancel();
    })
  }

  cancel() {
    this.modalService.close('calendarEditEventModal');
  }
}
