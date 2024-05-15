import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FileSystem } from '../models/file-system.model';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }

  getFolderFromId(id:number):Observable<FileSystem>{
    return this.httpClient.get(this._endpoint + 'file-system?filter=id||eq||'+id).pipe(map((data) => {
      return <FileSystem>data;
    }));
  }

  getChildFoldersById(parentId:number):Observable<FileSystem>{
    return this.httpClient.get(this._endpoint + 'file-system?filter=parentId||eq||'+parentId).pipe(map((data) => {
      return <FileSystem>data;
    }));
  }

  getFolderContentsById(parentId:number):Observable<FileSystem>{
    return this.httpClient.get(this._endpoint + 'file-system-content?filter=parentId||eq||'+parentId).pipe(map((data) => {
      return <FileSystem>data;
    }));
  }

  /**
   * Add a folder.
   * @param FileSystem filesystem object.
   *
   * @returns Observable<Contact>
   */
  addFolder(fileSystem: FileSystem): Observable<FileSystem> {

    if(!fileSystem) {
      throw new Error('fileSystem service: you must supply a fileSystem object for saving');
    }

    delete fileSystem.createdAt;
    delete fileSystem.updatedAt;

    if(fileSystem.id > 0) {
      throw new Error('fileSystem service: Cannot create a existing object');
    }

    delete fileSystem.id;

    return this.httpClient.post(this._endpoint + 'file-system',
    JSON.stringify(fileSystem),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <FileSystem>data;
    }));
  }
}
