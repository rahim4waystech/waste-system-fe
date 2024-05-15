import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';
import { map, take, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { Socket } from 'ngx-socket-io';
import { JobSmartWaste } from '../models/job-smart-waste.model';
import { YardTrade } from 'src/app/weighbridge/models/yard-trade.model';
import { User } from 'src/app/auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient, private socket: Socket) { }


 /**
  * Get a job from the backend by id
  *
  * @param id number id of job to get
  *
  * @returns Observable<Job>
  */
 getJobById(id: number): Observable<Job> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('JobService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'job/' + id + '?join=jobAssignment&join=jobAssignment.driver&join=jobAssignment.vehicle&join=jobAssignment.subcontractor&join=jobAssignment.trailer').pipe(map((value: any) => {
     return <Job>value;
  }));
 }

 // Does not include deleted
 getJobsByDate(date: string): Observable<Job[]> {

  if (!date || date === '') {
    throw new Error('JobService: date must be a valid date');
  }

  date = moment(date).format('YYYY-MM-DD');

  return this.httpClient.get(this._endpoint + 'job?filter=date||eq||"' + date + '"&filter=jobStatusId||ne||3&S&sort=blockNumber,ASC').pipe(map((value: any) => {
    return value as Job[];
 }));
}

 // Does not include deleted
 getJobsByDateForTransport(date: string, orderTypeId: number): Observable<Job[]> {

  if(!date || date === '') {
    throw new Error('JobService: date must be a valid date');
  }

  date = moment(date).format('YYYY-MM-DD');

 return this.httpClient.get(this._endpoint + `job/getJobsForTransport/${orderTypeId}/${date}`).pipe(map((value: any) => {
    return <Job[]>value;
 }));
}

getJobsByDateRange(start: string, end:string): Observable<Job[]> {



  if(!start || start === '') {
    throw new Error('JobService: Start Date must be a valid date');
  }
  if(!end || end === '') {
    throw new Error('JobService: End Date must be a valid date');
  }



  start = moment(start).format('YYYY-MM-DD');
  end = moment(end).format('YYYY-MM-DD');



 return this.httpClient.get(this._endpoint + 'job?filter=date||gte||' + start + '&filter=date||lte||' + end + '"&filter=jobStatusId||ne||3').pipe(map((value: any) => {
    return <Job[]>value;
 }));
}

 // Does not include deleted
 getJobsByDateRangeAndDirection(start: string, end:string, direction: number): Observable<Job[]> {

  if(!start || start === '') {
    throw new Error('JobService: Start Date must be a valid date');
  }
  if(!end || end === '') {
    throw new Error('JobService: End Date must be a valid date');
  }

  start = moment(start).format('YYYY-MM-DD');
  end = moment(end).format('YYYY-MM-DD');

 return this.httpClient.get(this._endpoint + 'job?filter=date||gte||' + start + '&filter=date||lte||' + end + '&filter=jobStatusId||ne||3&filter=account.isOwn||eq||'+ direction).pipe(map((value: any) => {
    return <Job[]>value;
 }));
}

 // Does not include deleted
 getJobsByOrderId(orderId: number): Observable<Job[]> {

  if(!orderId || orderId <=0) {
    throw new Error('JobService: orderId must be a valid date');
  }

 return this.httpClient.get(this._endpoint + 'job?filter=orderId||eq||"' + orderId + '"&filter=jobStatusId||ne||3').pipe(map((value: any) => {
    return <Job[]>value;
 }));
}

 // Does not include deleted
 getArticJobsByDate(date: string): Observable<Job[]> {

  if(!date || date === '') {
    throw new Error('JobService: date must be a valid date');
  }

  date = moment(date).format('YYYY-MM-DD');

 return this.httpClient.get(this._endpoint + 'job?filter=date||eq||"' + date + '"&filter=jobStatusId||ne||3').pipe(map((value: any) => {
    return <Job[]>value;
 }));
}

 /**
  * creates a job in the backend based on job object.
  * @param job job object.
  *
  * @returns Observable<Job>
  */
 createJob(job: Job): Observable<Job> {


   if(!job) {
     throw new Error('job service: you must supply a job object for saving');
   }

   delete job.createdAt;
   delete job.updatedAt;

   if(job.id > 0) {
     throw new Error('job service: Cannot create a existing object');
   }

   delete job.id;
   return this.httpClient.post(this._endpoint + 'job',
   JSON.stringify(job),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Job>data;
   }));
 }


 /**
  * updates a job in the backend based on job object.
  * @param job job object.
  *
  * @returns Observable<Job>
  */
 updateJob(job: Job): Observable<Job> {


   if(!job) {
     throw new Error('job service: you must supply a job object for saving');
   }

   delete job.createdAt;
   delete job.updatedAt;

   if(!job.id || job.id === -1) {
     throw new Error('job service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'job/' + job.id,
   JSON.stringify(job),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <Job>data;
   }));
 }

 bulkUpdateYardTrade(yardTrade: YardTrade[]): Observable<YardTrade[]> {


  if(!yardTrade || yardTrade.length === 0) {
    throw new Error('job service: you must supply a jobs array for saving');
  }

  yardTrade.forEach((job: any) => {
    delete job.createdAt;
    delete job.updatedAt;
    if(!job.id || job.id === -1) {
      throw new Error('job service: Cannot update an record without id');
    }
  });



  return this.httpClient.post(this._endpoint + 'yard-trade/bulk',
  JSON.stringify({"bulk": yardTrade}),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <YardTrade[]>data;
  }));
}


 bulkUpdateJob(jobs: Job[]): Observable<Job[]> {


  if(!jobs || jobs.length === 0) {
    throw new Error('job service: you must supply a jobs array for saving');
  }

  jobs.forEach((job: any) => {
    delete job.createdAt;
    delete job.updatedAt;

    delete job.tippingPrice;

    job.jobStatus = {id:job.jobStatusId} as any;

    // delete job.order;
    // delete job.jobStatus;
    delete job.driverJobStatus;

    if(job.updatedUser === null) {
      job.updatedUser = new User();
    }

    if(job.createdUser === null) {
      job.createdUser = new User();
    }

    if(!job.id || job.id === -1) {
      throw new Error('job service: Cannot update an record without id');
    }
  });



  return this.httpClient.post(this._endpoint + 'job/bulk',
  JSON.stringify({"bulk": jobs}),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Job[]>data;
  }));
}

  subscribeToClientEvents() {
   return this.socket
    .fromEvent("jobToClient")
    .pipe(map((data) => data))
  }

  sendJobChangeToClients(job: Job) {
// this.socket.emit("jobToServer", job);
  }

  getAllSmartWasteForJobId(jobId: number): Observable<JobSmartWaste[]> {
    if(jobId === -1 || !jobId) {
      throw new Error('getAllSmartWasteForJobId must have valid jobId');
    }

    return this.httpClient.get(this._endpoint + 'job-smart-waste?filter=jobId||eq||' + jobId + '&join=ewcCode')
    .pipe(map((data) => {
      return <JobSmartWaste[]>data;
    }))
  }

  generateWasteTransferNote(data: any) {
    return this.httpClient.post(this._endpoint + 'job/waste-transfer-note',JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}});

  }

  generateShreddingPDF(data: any) {
    return this.httpClient.post(this._endpoint + 'job/destruction-pdf',JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}});

  }

  generateTimelinePDF(data: any) {
    return this.httpClient.post(this._endpoint + 'job/timeline-pdf',JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}});

  }

  jobReport(filters:any={}): any {

    let query = '?1=1';

    if(filters['customer'] && filters['customer'] !== '') {
      query += '&filter=order.account.name||cont||' + filters['customer'];
    }

    if(filters['site'] && filters['site'] !== '') {
      query += "&filter=order.site.name||cont||" + filters['site'];
    }

    if(filters['orderRef'] && filters['orderRef'] !== '') {
      query += "&filter=order.id||eq||" + filters['orderRef'];
    }

    if(filters['startDate'] && filters['startDate'] !== '') {
      query += "&filter=date||gte||" + filters['startDate'];
    }

    if(filters['endDate'] && filters['endDate'] !== '') {
      query += "&filter=date||lte||" + filters['endDate'];
    }

    if(filters['tipSite'] && filters['tipSite'] !== '') {
      query += '&filter=order.tipSite.name||cont||' + filters['tipSite'];
    }


    if(filters['vehicle'] && filters['vehicle'] !== '') {
      query += '&filter=jobAssignment.vehicle.registration||cont||' + filters['vehicle'];
    }

    if(filters['driver'] && filters['driver'] !== '') {
      query += '&filter=jobAssignment.driver.lastName||cont||' + filters['driver'];
    }

    if(filters['subcontractor'] && filters['subcontractor'] !== '') {
      query += '&filter=jobAssignment.subcontractor.name||cont||' + filters['subcontractor'];
    }

    query+= "&filter=jobStatusId||in||2,4,5";


    return this.httpClient.get(this._endpoint + 'job' + query + '&join=order.tipSite&join=order.orderLines&join=jobAssignment&join=jobAssignment.vehicle&join=jobAssignment.driver&join=jobAssignment.subcontractor');
  }

  getAllJobsByIds(ids: string[]=[]) {
    if(!ids || ids.length === 0) {
      throw new Error('You must provide a list of ids for load jobs by id');
    }

    return this.httpClient.get(this._endpoint + 'job?filter=id||in||' + ids.join(','));
  }

  getAllJobsByIdsExpanded(ids: string[]=[]) {
    if(!ids || ids.length === 0) {
      throw new Error('You must provide a list of ids for load jobs by id');
    }

    let joinString = '&join=order.tipSite&join=order.orderLines&join=jobAssignment&jobAssignment.driver&join=jobAssignment.vehicle&join=jobAssignment.subcontractor&join=tippingPrice';

    return this.httpClient.get(this._endpoint + 'job?filter=id||in||' + ids.join(',') + joinString);
  }




  getSepaJobs(filters:any={}): any {
    return this.httpClient.post(this._endpoint + 'job/job-sepa', {tipSiteId: filters.tipSiteId,startDate: filters.startDate, endDate: filters.endDate});
  }

  loadCountReport(filters:any={}): any {

    let query = '?1=1';

    if(filters['customer'] && filters['customer'] !== '') {
      query += '&filter=order.account.name||cont||' + filters['customer'];
    }

    if(filters['site'] && filters['site'] !== '') {
      query += "&filter=order.site.name||cont||" + filters['site'];
    }

    if(filters['orderRef'] && filters['orderRef'] !== '') {
      query += "&filter=order.id||eq||" + filters['orderRef'];
    }

    if(filters['startDate'] && filters['startDate'] !== '') {
      query += "&filter=date||gte||" + filters['startDate'];
    }

    if(filters['endDate'] && filters['endDate'] !== '') {
      query += "&filter=date||lte||" + filters['endDate'];
    }

    if(filters['tipSite'] && filters['tipSite'] !== '') {
      query += '&filter=order.tipSite.name||cont||' + filters['tipSite'];
    }

    if(filters['parentJobId'] && filters['parentJobId'] !== '') {
      query += '&filter=order.id||eq||' + filters['parentJobId'];
    }

    if(filters['id'] && filters['id'] !== '') {
      query += '&filter=id||eq||' + filters['id'];
    }

    if(filters['driver'] && filters['driver'] !== '') {
      query += '&filter=jobAssignment.driver.id||eq||' + filters['driver'];
    }


    if(filters['vehicle'] && filters['vehicle'] !== '') {
      query += '&filter=jobAssignment.vehicle.registration||cont||' + filters['vehicle'];
    }


    // show only signed
    query += "&filter=jobManagerSignOff||eq||1";

    return this.httpClient.get(this._endpoint + 'job' + query + '&join=order.tipSite&join=order.orderLines&join=jobAssignment&join=jobAssignment.driver&join=jobAssignment.vehicle');
  }
}
