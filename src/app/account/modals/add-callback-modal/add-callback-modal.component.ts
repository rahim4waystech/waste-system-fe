import { Component, Input, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { CalendarEvent } from 'src/app/calendar/models/calendar-event.model';
import { Calendar } from 'src/app/calendar/models/calendar.model';
import { CalendarEventService } from 'src/app/calendar/services/calendar-event.service';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-add-callback-modal',
  templateUrl: './add-callback-modal.component.html',
  styleUrls: ['./add-callback-modal.component.scss']
})
export class AddCallbackModalComponent implements OnInit {

  isServerError: boolean = false;
  isError: boolean = false;

  entityType = 'account';
  
  date: string = '';
  description: string = '';
  calendarId: number = -1;
  @Input()
  entity: any = {};
  calendars: Calendar[] = [];

  constructor(private calendarService: CalendarService,
    private modalService: ModalService,
    private calendarEventService: CalendarEventService) { }

  ngOnInit(): void {
    this.calendarService.getAll()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not get list of calendars');
      return e;
    }))
    .subscribe((data:any) => {
      this.calendars = data;
    })
  }

  save() {
    if(this.date === '' || this.description === '') {
      this.isError = true;
    }

    const event = new CalendarEvent();
    event.isFullDay = true;
    event.date = this.date;
    event.description = event.description;
    event.name = 'Callback for  ' + this.entity.name;
    event.startTime = '00:00:00';
    event.endTime = '00:00:00';
    event.calendarId = this.calendarId;

    this.calendarEventService.createEvent(event)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not create event for callback');
      return e;
    }))
    .subscribe((newEvent: CalendarEvent) => {
      this.syncEvent(newEvent);
    });

  }

  syncEvent(event: CalendarEvent) {
    this.calendarEventService.syncEvent(event.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      window.location.reload();
      return e;
    }))
    .subscribe(() => {
      window.location.reload();
    })
  }

  close() {
    this.date = '';
    this.description = '';

    this.modalService.close('addCallbackModal');
  }

}
