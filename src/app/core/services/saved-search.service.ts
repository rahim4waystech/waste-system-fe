import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SavedSearch } from '../models/saved-search.model';

@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {

  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  
  getAll(): Observable<SavedSearch[]> {
    return this.httpClient.get(this._endpoint + 'saved-search').pipe(map((data) => {
      return <SavedSearch[]>data;
    }))
  }

  getAllByEntity(entityName:string): Observable<SavedSearch[]> {

    if(!entityName || entityName === '') {
      throw new Error('You must supply a valid entity name');
    }

    return this.httpClient.get(this._endpoint + 'saved-search?filter=entity||eq||' + entityName).pipe(map((data) => {
      return <SavedSearch[]>data;
    }))
  }

  getSearchById(id: number): Observable<SavedSearch> {
    if(!id || id === -1) {
      throw new Error('You must provide a valid id for getSearchById');
    }

    return this.httpClient.get(this._endpoint + 'saved-search/' + id).pipe(map((data) => {
      return <SavedSearch>data;
    }));
  }

  createSavedSearch(search: SavedSearch): Observable<SavedSearch> {


    if(!search) {
      throw new Error('search service: you must supply a search object for saving');
    }
  
    delete search.createdAt;
    delete search.updatedAt;
  
    if(search.id > 0) {
      throw new Error('search service: Cannot create a existing object');
    }
  
    delete search.id;
  
  
    return this.httpClient.post(this._endpoint + 'saved-search',
    JSON.stringify(search),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <SavedSearch>data;
    }));
  }
  
  
  updateSavedSearch(search: SavedSearch): Observable<SavedSearch> {
  
  
    if(!search) {
      throw new Error('saved search service: you must supply a search object for saving');
    }
  
    delete search.createdAt;
    delete search.updatedAt;
  
  
    if(!search.id || search.id === -1) {
      throw new Error('saved search service: Cannot update an record without id');
    }
  
  
    return this.httpClient.put(this._endpoint + 'saved-search/' + search.id,
    JSON.stringify(search),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <SavedSearch>data;
    }));
  }
}
