import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Discussion } from '../models/discussion.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) {}

  getDiscussionByEntityNameAndId(entity:string, id: number): Observable<Discussion[]> {

    if(id <= 0 || id === null || id === undefined) {
      throw new Error('DiscussionService: Id must be a valid number');
    }

    if(!entity || entity === '') {
      throw new Error('DiscussionService: entity name must be a valid string');
    }

   return this.httpClient.get(this._endpoint + 'discussion/?filter=entityId||eq||' + id + '&filter=entityType||eq||' + entity).pipe(map((value: any) => {
      return <Discussion[]>value;
   }));
  }


 createDiscussion(discussion: Discussion): Observable<Discussion> {


  if(!discussion) {
    throw new Error('discussion service: you must supply a discussion object for saving');
  }

  delete discussion.createdAt;
  delete discussion.updatedAt;
  delete discussion.createdBy;
  delete discussion.user;

  if(discussion.id > 0) {
    throw new Error('discussion service: Cannot create a existing object');
  }

  delete discussion.id;


  return this.httpClient.post(this._endpoint + 'discussion',
  JSON.stringify(discussion),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Discussion>data;
  }));
}


updateDiscussion(discussion: Discussion): Observable<Discussion> {


  if(!discussion) {
    throw new Error('discussion service: you must supply a discussion object for saving');
  }

  delete discussion.createdAt;
  delete discussion.updatedAt;


  if(!discussion.id || discussion.id === -1) {
    throw new Error('discussion service: Cannot update an record without id');
  }


  return this.httpClient.put(this._endpoint + 'discussion/' + discussion.id,
  JSON.stringify(discussion),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Discussion>data;
  }));
}

  }
