import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { JobAssignment } from '../models/job-assignment.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Account } from 'src/app/order/models/account.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { Job } from '../models/job.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { TrailerStatus } from '../models/trailer-status.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class JobAssignmentService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a job assignment from the backend by id
  *
  * @param id number id of job assignment to get
  *
  * @returns Observable<JobAssignment>
  */
 getJobAssignmentById(id: number): Observable<JobAssignment> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('JobAssignmentService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'job-assignment/' + id).pipe(map((value: any) => {
     return <JobAssignment>value;
  }));
 }

 getJobAssignmentsByIds(ids: number[]): Observable<JobAssignment[]> {

  if(ids === null || ids === undefined || ids.length === 0) {
    throw new Error('getJobAssignmentsByIds: please supply at least one job assignment id');
  }

 return this.httpClient.get(this._endpoint + 'job-assignment?filter=id||in||' + ids.join(',') + '&join=vehicle').pipe(map((value: any) => {
    return <JobAssignment[]>value;
 }));
}

 /**
  * Get a job assignment from the backend by id
  *
  * @param id number id of job assignment to get
  *
  * @returns Observable<JobAssignment>
  */
 getArticJobAssignmentById(id: number): Observable<JobAssignment> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('JobAssignmentService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'job-assignment/' + id + '"&join=vehicle&join=driver&join=trailer&join=subcontractor').pipe(map((value: any) => {
     return <JobAssignment>value;
  }));
 }


 /**
  * creates a job assignment in the backend based on assignment object.
  * @param jobAssignment assignment object.
  *
  * @returns Observable<JobAssignment>
  */
 createJobAssignment(jobAssignment: JobAssignment): Observable<JobAssignment> {


   if(!jobAssignment) {
     throw new Error('job assignment service: you must supply a job assignment object for saving');
   }

   delete jobAssignment.createdAt;
   delete jobAssignment.updatedAt;

   if(jobAssignment.id > 0) {
     throw new Error('job assignment service: Cannot create a existing object');
   }

   delete jobAssignment.id;
   return this.httpClient.post(this._endpoint + 'job-assignment',
   JSON.stringify(jobAssignment),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <JobAssignment>data;
   }));
 }

 copyJobs(jobAssignments: JobAssignment[] = [], jobs: Job[] = [], date: string='', orderTypeId:number=-1): Observable<any> {

  return this.httpClient.post(this._endpoint + 'job-assignment/copy',
  JSON.stringify({
    jobAssignments: jobAssignments,
    jobs: jobs,
    date: date,
    orderTypeId: orderTypeId,
  }),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <any>data;
  }));
}


 /**
  * updates a job assignment in the backend based on job assignment object.
  * @param jobAssignment job assignment object.
  *
  * @returns Observable<JobAssignment>
  */
 updateJobAssignment(assignment: JobAssignment): Observable<JobAssignment> {

  let jobAssignment = JSON.parse(JSON.stringify(assignment));


   if(!jobAssignment) {
     throw new Error('job assignment service: you must supply a job assignment object for saving');
   }

   if(jobAssignment.depot === null) {
     jobAssignment.depot = new Account();
   }

   if(jobAssignment.trailer === null) {
     jobAssignment.trailer = new Vehicle();
   }

   if(jobAssignment.vehicle === null) {
     jobAssignment.vehicle = new Vehicle();
   }

   if(jobAssignment.driver === null) {
     jobAssignment.driver = new Driver();
   }

   delete jobAssignment.driver;
   delete jobAssignment.vehicle;
   delete jobAssignment.subcontractor;
   delete jobAssignment['recurrence'];
   delete jobAssignment['jobs'];
   delete jobAssignment.trailer;
   delete jobAssignment.createdAt;
   delete jobAssignment.updatedAt;


   if(jobAssignment.driverId === -1 || jobAssignment.driverId === null) {

    //  alert('ERROR - Problem saving job assignment contact support on 0141 2642729 do not leave this page');
     console.log('--WARNING FOUND DRIVER id OF -1 ON SAVING JOB ASSIGNMENT-- ' + moment().format('YYYY-MM-DD H:m:s'));
     console.trace();
     console.log(JSON.stringify(jobAssignment));
     console.log('-- END WARNING FOR JOB ASSIGNMENT --');

     localStorage.setItem('ERROR_JA_PROBLEM_MJL', JSON.stringify(jobAssignment));
     localStorage.setItem('ERROR_JA_PROBLEM_MJL_STACK', new Error().stack);

   }

   if(!jobAssignment.id || jobAssignment.id === -1) {
     throw new Error('job assignment service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'job-assignment/' + jobAssignment.id,
   JSON.stringify(jobAssignment),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <JobAssignment>data;
   }));
 }

 getAllJobAssignmentByDate(date: string=''): Observable<JobAssignment[]> {
  if(!date || date === '') {
    throw new Error('Date must be supplied in getAllJobAssignmentByDate');
  }

  return this.httpClient.get(this._endpoint + 'job-assignment?filter=date||eq||"' + date + '"').pipe(map((data) => {
    return <JobAssignment[]>data;
  }));
 }

 getAllJobAssignmentByDateExpanded(date: string=''): Observable<JobAssignment[]> {
  if(!date || date === '') {
    throw new Error('Date must be supplied in getAllJobAssignmentByDate');
  }

  return this.httpClient.get(this._endpoint + 'job-assignment?filter=date||eq||"' + date + '"&join=vehicle&join=driver&join=subcontractor').pipe(map((data) => {
    return <JobAssignment[]>data;
  }));
 }

 getAllJobAssignmentRoutesByDate(date: string=''): Observable<JobAssignment[]> {
  if(!date || date === '') {
    throw new Error('Date must be supplied in getAllJobAssignmentByDate');
  }

  // Limit by vehicle type?
  return this.httpClient.get(this._endpoint + 'job-assignment?filter=date||eq||"' + date + '"&join=vehicle&join=driver&join=trailer&join=subcontractor').pipe(map((data) => {
    return <JobAssignment[]>data;
  }));
 }

 getAllJobAssignmentRoutesByDateByOrderType(date: string='', orderTypeId: number): Observable<JobAssignment[]> {
  if(!date || date === '') {
    throw new Error('Date must be supplied in getAllJobAssignmentByDate');
  }

    if(!orderTypeId || orderTypeId === -1) {
    throw new Error('orderTypeId must be supplied in getAllJobAssignmentByDate');
  }

  // Limit by vehicle type?
  return this.httpClient.get(this._endpoint + 'job-assignment?filter=date||eq||"' + date + '"&join=vehicle&join=driver&join=trailer&join=subcontractor&filter=orderTypeId||eq||' + orderTypeId + '&sort=slotNumber,ASC').pipe(map((data) => {
    return <JobAssignment[]>data;
  }));
 }

 bulkCreateJobAssignment(jobAssignments: JobAssignment[]): any {

  jobAssignments.forEach((jobAssignment) => {
   delete jobAssignment.createdAt;
   delete jobAssignment.updatedAt;
   delete jobAssignment.id;
  });
 return this.httpClient.post(this._endpoint + 'job-assignment/bulk', {bulk: jobAssignments}).pipe(map((data) => {
    return <JobAssignment[]>data;
   }));
 }

 bulkUpdateJobAssignment(jobAssignments: JobAssignment[]): any {


  jobAssignments.forEach((jobAssignment) => {
   delete jobAssignment.createdAt;
   delete jobAssignment.updatedAt;

   if(jobAssignment.depot === null) {
    jobAssignment.depot = new Account();
  }

  if(jobAssignment.trailer === null) {
    jobAssignment.trailer = new Vehicle();
  }

  if(jobAssignment.vehicle === null) {
    jobAssignment.vehicle = new Vehicle();
  }

  if(jobAssignment.driver === null) {
    jobAssignment.driver = new Driver();
  }

  if(jobAssignment.subcontractor === null) {
    jobAssignment.subcontractor = new Subcontractor();
  }

  delete jobAssignment.driver;
  delete jobAssignment.vehicle;
  delete jobAssignment.subcontractor;
  delete jobAssignment.depot;
  delete jobAssignment.trailer;
  delete jobAssignment.jobs;
  delete jobAssignment['recurrence'];
  });
 return this.httpClient.post(this._endpoint + 'job-assignment/bulk', {bulk: jobAssignments}).pipe(map((data) => {
    return <JobAssignment[]>data;
   }));
 }

 deleteJobAssignment(id: number) {
   if(!id || id === -1) {
     throw new Error('cannot delete job assignment without a valid id');
   }
   return this.httpClient.delete(this._endpoint + 'job-assignment/' + id);
 }


 checkIfJobAssignmentExistsForDate(date: string, driverId: number, vehicleId: number) {
   if(!date || date === '') {
    throw new Error('must supply a valid date');
   }

   if(!driverId || driverId === -1) {
    throw new Error('must supply a valid driverId');
   }

   if(!vehicleId || vehicleId === -1) {
    throw new Error('must supply a valid vehicleId');
   }

   return this.httpClient.get(this._endpoint + 'job-assignment?filter=date||eq||' + date + '&filter=driverId||eq||' + driverId + '&filter=vehicleId||eq||' + vehicleId);
 }


 checkIfSubbieJobAssignmentExistsForDate(date: string, subcontractorid: number) {
   if(!date || date === '') {
    throw new Error('must supply a valid date');
   }

   if(!subcontractorid || subcontractorid === -1) {
    throw new Error('must supply a valid subcontractor');
   }

   return this.httpClient.get(this._endpoint + 'job-assignment?filter=date||eq||' + date + '&filter=subcontractorId||eq||' + subcontractorid);
 }


 autoPair(date: string, vehicleTypeId: number, orderTypeId: number) {
  if(!date || date === '') {
    throw new Error('must supply a valid date');
   }

   if(!vehicleTypeId || vehicleTypeId === -1) {
    throw new Error('must supply a valid vehicle type id');
   }

   if(!orderTypeId || orderTypeId === -1) {
    throw new Error('must supply a valid order type id');
   }

   return this.httpClient.get(this._endpoint + `job-assignment/autopair/${date}/${vehicleTypeId}/${orderTypeId}`);
 }

 getNextSlotId(date: string, orderTypeId: number) {
  if(!date || date === '') {
    throw new Error('must supply a valid date');
   }

   if(!orderTypeId || orderTypeId === -1) {
    throw new Error('must supply a valid order type id');
   }

   return this.httpClient.get(this._endpoint + `job-assignment/nextSlotId/${date}/${orderTypeId}`);
 }

 /**New Work**/
 bulkCreateJobAssignment2(jobAssignments: JobAssignment[]): any {

  jobAssignments.forEach((jobAssignment) => {
   delete jobAssignment.createdAt;
   delete jobAssignment.updatedAt;
   delete jobAssignment.id;
  });
 return this.httpClient.post(this._endpoint + 'job-assignment/assignjob', {bulk: jobAssignments}).pipe(map((data) => {
    return <JobAssignment[]>data;
   }));
 }

getAllTrailerStatuses(): Observable<TrailerStatus[]> {

  return this.httpClient.get(this._endpoint + 'trailer-status').pipe(map((value: any) => {
     return <TrailerStatus[]>value;
  }));
 }
 
}
