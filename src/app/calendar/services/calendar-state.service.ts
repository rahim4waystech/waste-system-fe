import { Injectable } from '@angular/core';
import { CalendarEvent } from '../models/calendar-event.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarStateService {

  $eventAdded: Subject<CalendarEvent> = new Subject();
  constructor() { }
}
