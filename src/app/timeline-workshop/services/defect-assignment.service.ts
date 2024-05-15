import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DefectAssignment } from 'src/app/timeline-transport/models/defect-assignment.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DefectAssignmentService {


    /**
    * Endpoint for http calls
    */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) {}

  createDefectAssignment(assignment: DefectAssignment): Observable<DefectAssignment> {
    if(!assignment) {
      throw new Error('defect service: you must supply a defect assignment object for saving');
    }

    delete assignment.id;
    delete assignment.updatedAt;
    delete assignment.createdAt;

    return this.httpClient.post(this._endpoint + 'defect-assignment/',
    JSON.stringify(assignment),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <DefectAssignment>data;
    }));
  }

  getAllDefectAssignmentByDate(date: string): Observable<DefectAssignment[]> {
    if(!date || date === '') {
      throw new Error('You must provide a date in getAllDefectAssignmentByDate');
    }

    return this.httpClient.get(this._endpoint + 'defect-assignment?filter=date||eq||"'+ date+'"').pipe(map((data) => {
      return <DefectAssignment[]>data;
    }))
  }

  deleteDefectAssignment(id: number) {
    if(!id || id === -1) {
      throw new Error('cannot delete defect assignment without a valid id');
    }
    return this.httpClient.delete(this._endpoint + 'defect-assignment/' + id);
  }

  updateDefectAssignment(assignment: DefectAssignment): Observable<DefectAssignment> {
    if(!assignment) {
      throw new Error('defect service: you must supply a defect assignment object for saving');
    }


    delete assignment.updatedAt;

    return this.httpClient.put(this._endpoint + 'defect-assignment/' + assignment.id,
    JSON.stringify(assignment),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <DefectAssignment>data;
    }));
  }

  getById(id:number): Observable<DefectAssignment[]> {

    return this.httpClient.get(this._endpoint + 'defect-assignment?filter=id||eq||'+ id).pipe(map((data) => {
      return <DefectAssignment[]>data;
    }))
  }

}
