import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs-compat/operator/take';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CorrespondenceType } from '../models/correspondence-type.model';
import { Correspondence } from '../models/correspondence.model';
import { EmailLog } from '../models/email-log.model';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

 getAllTypes(): Observable<CorrespondenceType[]> {
   return this.httpClient.get(this._endpoint + 'correspondence-type').pipe(map((data) => {
      return <CorrespondenceType[]>data;
   }));
   
 }

 getCorrespondenceById(id: number): Observable<Correspondence> {
  if(!id || id === -1) {
    throw new Error('You must provide a valid id for getCorrespondenceById');
  }

  return this.httpClient.get(this._endpoint + 'correspondence/' + id).pipe(map((data) => {
    return <Correspondence>data;
  }))
 }
 createCorrespondence(correspondence: Correspondence): Observable<Correspondence> {


  if(!correspondence) {
    throw new Error('correspondence service: you must supply a correspondence object for saving');
  }

  delete correspondence.createdAt;
  delete correspondence.updatedAt;
  delete correspondence.createdBy;
  // delete <any>(correspondence).user;

  if(correspondence.id > 0) {
    throw new Error('discussion service: Cannot create a existing object');
  }

  delete correspondence.id;


  return this.httpClient.post(this._endpoint + 'correspondence',
  JSON.stringify(correspondence),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Correspondence>data;
  }));
}

 sendEmail(log: EmailLog): Observable<EmailLog> {


  if(!log) {
    throw new Error('correspondence service: you must supply a log object for saving');
  }

  return this.httpClient.post(this._endpoint + 'correspondence/send-email',
  JSON.stringify(log),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <EmailLog>data;
  }));
}


updateCorrespondence(correspondence: Correspondence): Observable<Correspondence> {


  if(!correspondence) {
    throw new Error('correspondence service: you must supply a correspondence object for saving');
  }

  delete correspondence.createdAt;
  delete correspondence.updatedAt;


  if(!correspondence.id || correspondence.id === -1) {
    throw new Error('correspondence service: Cannot update an record without id');
  }


  return this.httpClient.put(this._endpoint + 'correspondence/' + correspondence.id,
  JSON.stringify(correspondence),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Correspondence>data;
  }));
}

getByCalenderId(calendarId: number=-1) {
  if(!calendarId || calendarId === -1) {
    throw new Error('You must supply a calendar id to getByCalendarId');
  }

  return this.httpClient.get(this._endpoint + 'correspondence?filter=calendarId||eq||' + calendarId);
} 
}
