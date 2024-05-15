import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticRunDiaryService {

  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }

  transformRecords(jobs:Job[]) {
    jobs.forEach((job: Job) => {
      job.date = moment(job.date).format('DD-MM-YYYY');

      job.jobAssignment = !job.jobAssignment || job.jobAssignment === null ? new JobAssignment() : job.jobAssignment;
    });

    return jobs;
  }
  
  getAllJobsForRunDiary(searchFilters:any={}, page: number=1, amount: number=10): Observable<any> {

    
      let filterString: string = '&sort=time,ASC';
      
      if(searchFilters['date'] !== '' && searchFilters['date']) {
        filterString += '&filter=date||eq||"' + searchFilters['date'] + '"';
      }

      if(searchFilters['vehicle'] !== '' && searchFilters['vehicle']) {
        filterString += '&filter=jobAssignment.vehicle.registration||cont||"' + searchFilters['vehicle'] + '"';
      }

      if(searchFilters['driver'] !== '' && searchFilters['driver']) {
        filterString += '&filter=jobAssignment.driver.firstName||cont||"' + searchFilters['driver'] + '"';
      }

      if(searchFilters['subcontractor'] !== '' && searchFilters['subcontractor']) {
        filterString += '&filter=jobAssignment.subcontractor.name||cont||"' + searchFilters['subcontractor'] + '"';
      }
      
      if(searchFilters['orderRef'] !== '' && searchFilters['orderRef']) {
        filterString += '&filter=order.poNumber||eq||"' + searchFilters['orderRef'] + '"';
      }

      if(searchFilters['jobNumber'] !== '' && searchFilters['jobNumber']) {
        filterString += '&filter=id||eq||' + searchFilters['jobNumber'];
      }

      if(searchFilters['parentJobId'] !== '' && searchFilters['parentJobId']) {
        filterString += '&filter=orderId||eq||' + searchFilters['parentJobId'];
      }

      if(searchFilters['customer'] !== '' && searchFilters['customer']) {
        filterString += '&filter=order.accountId||eq||' + searchFilters['customer'];
      }

      if(searchFilters['time'] !== '' && searchFilters['time']) {
        filterString += '&filter=time||eq||' + searchFilters['time'];
      }
       
      return this.httpClient.get(this._endpoint + 'job?page=' + page + '&limit=' + amount + '&join=jobStatus&join=driverJobStatus&join=order.tipSite&join=jobAssignment&join=jobAssignment.driver&join=jobAssignment.subcontractor&join=jobAssignment.trailer&join=jobAssignment.vehicle&join=order.orderLines&join=order.unit&filter=jobStatusId||ne||3' + filterString);

      
  }



}
