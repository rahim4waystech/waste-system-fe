import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DefectJob } from '../models/defect-job.model';
import { Observable } from 'rxjs';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { Fitter } from 'src/app/fitter/models/fitter.model';

@Injectable({
  providedIn: 'root'
})
export class DefectJobService {

      /**
    * Endpoint for http calls
    */
   private _endpoint: string = environment.api.endpoint;

   constructor(private httpClient: HttpClient) {}

   getAllDefectJobsForDate(date: string): Observable<DefectJob[]> {
     if(!date || date === "") {
       throw new Error('Please provide date for getAllDefectJobsForDate');
     }

     return this.httpClient.get(this._endpoint + 'defect-job?filter=deleted||eq||false&filter=date||eq||"' + date + '"').pipe(map((data) => {
       return <DefectJob[]>data;
     }));
   }

   createDefectJob(job: DefectJob): Observable<DefectJob> {
    if(!job) {
      throw new Error('defect service: you must supply a defect assignment object for saving');
    }

    delete job.id;
    delete job.updatedAt;
    delete job.createdAt;

    return this.httpClient.post(this._endpoint + 'defect-job/',
    JSON.stringify(job),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <DefectJob>data;
    }));
  }

  updateDefectJob(job: DefectJob): Observable<DefectJob> {
    if(!job) {
      throw new Error('defect service: you must supply a defect assignment object for saving');
    }


    delete job.updatedAt;
    delete job.createdAt;

    return this.httpClient.put(this._endpoint + 'defect-job/' + job.id,
    JSON.stringify(job),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <DefectJob>data;
    }));
  }

  bulkUpdateJob(jobs: DefectJob[]): Observable<DefectJob[]> {


    if(!jobs || jobs.length === 0) {
      throw new Error('job service: you must supply a jobs array for saving');
    }

    jobs.forEach((job: any) => {
      delete job.createdAt;
      delete job.updatedAt;

      if(!job.id || job.id === -1) {
        throw new Error('job service: Cannot update an record without id');
      }
    });



    return this.httpClient.post(this._endpoint + 'defect-job/bulk',
    JSON.stringify({"bulk": jobs}),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <DefectJob[]>data;
    }));
  }

  getJobsByDefectId(defectId:number): Observable<DefectJob[]>{
    return this.httpClient.get(this._endpoint + 'defect-job?filter=defectId||eq||'+defectId).pipe(map((data) => {
      return <DefectJob[]>data;
    }))
  }
}
