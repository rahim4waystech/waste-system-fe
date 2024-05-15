import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Document} from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getDocumentsByEntityAndEntityId(entity:string,entityId:number):Observable<Document>{
    return this.httpClient.get(this._endpoint + 'documents?filter=entity||eq||'+entity+'&filter=entityId||eq||'+entityId).pipe(map((value:any)=>{
      return <Document>value;
    }))
  }

  getDocumentsByFolderId(id:number):Observable<Document>{
    return this.httpClient.get(this._endpoint + 'documents?filter=folderId||eq||'+id).pipe(map((value:any)=>{
      return <Document>value;
    }))
  }

  getImageById(id:number){
    return this.httpClient.get(this._endpoint + 'documents/getimage/'+id);
  }

  getPdfById(id:number){
    return this.httpClient.get(this._endpoint + 'documents/getpdf/'+id);
  }

  addDoc(document: Document): Observable<Document> {
    if(!document) {
      throw new Error('document service: you must supply a document object for saving');
    }

    delete document.updatedAt;
    delete document.createdAt;
    delete document.id;

    return this.httpClient.post(this._endpoint + 'documents/',
    JSON.stringify(document),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Document>data;
    }));
  }
}
