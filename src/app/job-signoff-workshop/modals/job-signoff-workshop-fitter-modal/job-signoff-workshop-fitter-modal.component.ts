import { Component, OnInit, Input } from '@angular/core';
import { DefectJob } from 'src/app/timeline-workshop/models/defect-job.model';
import { DefectJobService } from 'src/app/timeline-workshop/services/defect-job.service';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-job-signoff-workshop-fitter-modal',
  templateUrl: './job-signoff-workshop-fitter-modal.component.html',
  styleUrls: ['./job-signoff-workshop-fitter-modal.component.scss']
})
export class JobSignoffWorkshopFitterModalComponent implements OnInit {

  @Input()
  jobs: any[] = [];

  notes: string = '';
  constructor(private defectJobService: DefectJobService, private modalService: ModalService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.modalService.close('jobSignOffWorkshopFitterModal');
  }

  save() {
    this.jobs.forEach((job: DefectJob) => {
      // job.ended = moment().format('YYYY-MM-DD');
      job.defectStatusId = 6;
      job.defectStatus = {id: 6} as any;
      job.notes = this.notes;
     });
 
     this.defectJobService.bulkUpdateJob(this.jobs)
     .pipe(take(1))
     .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
       alert('Could not updated jobs in database');
       return e;
     }))
     .subscribe(() => {
       this.cancel();
     })
  }

}
