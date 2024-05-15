import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CalendarEvent } from '../models/calendar-event.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 getAllEventsForCalendar(id: number) {
  if(!id || id === -1) {
    throw new Error('You must supply a valid id for getAllEventsForCalendar');
  }

  return this.httpClient.get(this._endpoint + 'calendar-event?filter=calendarId||eq||' + id).pipe(map((data) => {
    return <CalendarEvent[]>data;
  }))
 }

 syncEvent(id: number): Observable<any> {
  if(!id || id === -1) {
    throw new Error('calendar event service: you must supply a event id to sync');
  }
  return this.httpClient.post(this._endpoint + 'calendar-event/sync/' + id,
  JSON.stringify({}),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return data;
  }));
}



 createEvent(event: CalendarEvent): Observable<CalendarEvent> {


  if(!event) {
    throw new Error('calendar event service: you must supply a event object for saving');
  }

  delete event.createdAt;
  delete event.updatedAt;

  if(event.id > 0) {
    throw new Error('calendar event service: Cannot create a existing object');
  }

  delete event.id;
  return this.httpClient.post(this._endpoint + 'calendar-event',
  JSON.stringify(event),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <CalendarEvent>data;
  }));
}


updateEvent(event: CalendarEvent): Observable<CalendarEvent> {


  if(!event) {
    throw new Error('calendar event service: you must supply a calendar event object for saving');
  }


  delete event.updatedAt;

  if(!event.id || event.id === -1) {
    throw new Error('calendar event service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'calendar-event/' + event.id,
  JSON.stringify(event),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <CalendarEvent>data;
  }));
}
}
