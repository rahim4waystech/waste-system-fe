import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DriverJobMovement } from '../models/driver-job-movement.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PodService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

 updatePOD(pod: DriverJobMovement): Observable<DriverJobMovement> {


  if(!pod) {
    throw new Error('pod service: you must supply a pod object for saving');
  }

  
  delete pod.updatedAt;

  if(!pod.id || pod.id === -1) {
    throw new Error('pod service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'driver-job-movement/' + pod.id,
  JSON.stringify(pod),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <DriverJobMovement>data;
  }));
}

 getPODById(id: number) {
  if(!id || id === -1) {
    throw new Error('You provide a valid id in getPODById');
  }

  return this.httpClient.get(this._endpoint + 'driver-job-movement/' + id + '?join=driver&join=vehicle&join=job&join=job.order');
 }

 getPodsByJobId(jobId:number) {
  if(!jobId || jobId === -1) {
    throw new Error('You provide a valid id in getPODById');
  }

  return this.httpClient.get(this._endpoint + 'driver-job-movement?filter=active||eq||1&filter=jobId||eq||' + jobId);

 }

 getByPodsByDate(date:string='') {
  if(!date || date === '') {
    throw new Error('You provide a valid date in getByPodsByDate');
  }

  return this.httpClient.get(this._endpoint + 'driver-job-movement?filter=active||eq||1&filter=job.date||eq||' + date + '&join=job');

 }

 getSinglePDF(id: number, data:any) {

  return this.httpClient.post(this._endpoint + 'driver-job-movement/pdf/' + id + '?type=' + environment.invoicing.podTemplate,
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json' } });
}

getBatchPDF(podIds: number[], template: string='pod', tipDetails: boolean=false) {
 
  return this.httpClient.post(this._endpoint + 'driver-job-movement/pdf-batch', JSON.stringify({
    podIds: podIds,
    invoicingInfo: environment.invoicing,
    template: template,
    tipDetails: tipDetails,
  }),{ headers: { 'Content-Type': 'application/json' } } );
}

emailPod(podIds: any, email: string, message: string) {

  if (podIds.length === 0 || !podIds) {
    throw new Error('Please provide valid podIds in emailInvoices');
  }

  if (!email || email === '') {
    throw new Error('Please provide valid email in emailInvoices');
  }

  if (!message || message === '') {
    throw new Error('Please provide valid message in emailInvoices');
  }

  return this.httpClient.post(this._endpoint + 'driver-job-movement/email/',
    JSON.stringify({
      podIds: podIds,
      toEmail: email,
      message: message,
      invoicingInfo: environment.invoicing,
    }),
    { headers: { 'Content-Type': 'application/json' } });
}

 getAllStatusHistoryForPOD(jobId:number) {
   if(!jobId || jobId === -1) {
     throw new Error('You must provide a valid jobId in getAllStatusHistoryForPOD');
   }

   return this.httpClient.get(this._endpoint + 'driver-job-status-details?filter=jobId||eq||' + jobId + '&join=DriverJobStatus');
 }

 getAllStatuses() {
   return this.httpClient.get(this._endpoint + 'driver-job-status');
 }

}
