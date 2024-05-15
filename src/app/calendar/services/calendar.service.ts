import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Calendar } from '../models/calendar.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

 getAll(): Observable<Calendar[]> {
   return this.httpClient.get(this._endpoint + 'calendar').pipe(map((data) => {
     return <Calendar[]>data;
   }));
 }

 getCalendarById(id: number): Observable<Calendar> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('CalendarService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'calendar/' + id).pipe(map((value: any) => {
    return <Calendar>value;
 }));
}

 createCalendar(calendar: Calendar): Observable<Calendar> {


  if(!calendar) {
    throw new Error('calendar service: you must supply a calendar object for saving');
  }

  delete calendar.createdAt;
  delete calendar.updatedAt;

  if(calendar.id > 0) {
    throw new Error('calendar service: Cannot create a existing object');
  }

  delete calendar.id;
  return this.httpClient.post(this._endpoint + 'calendar',
  JSON.stringify(calendar),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Calendar>data;
  }));
}


updateCalendar(calendar: Calendar): Observable<Calendar> {


  if(!calendar) {
    throw new Error('calendar service: you must supply a calendar object for saving');
  }


  delete calendar.updatedAt;

  if(!calendar.id || calendar.id === -1) {
    throw new Error('calendar service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'calendar/' + calendar.id,
  JSON.stringify(calendar),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Calendar>data;
  }));
}
}
