import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';

@Component({
  selector: 'app-job-signoff-land-delete-all',
  templateUrl: './job-signoff-land-delete-all.component.html',
  styleUrls: ['./job-signoff-land-delete-all.component.scss']
})
export class JobSignoffLandDeleteAllComponent implements OnInit {

  jobs: Job[] = [];
  constructor(private jobService: JobService) { }

  ngOnInit(): void {
  }

  delete() {
    this.jobs.forEach((job) => {
      job.jobStatusId = 3;
      job.jobStatus = {id: 3} as any;
      job.jobManagerSignOff = false;
      job.jobSignOffStatusId = -1;
    })

    this.jobService.bulkUpdateJob(this.jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not delete jobs');
      return e;
    }))
    .subscribe(() => {
      this.cancel();
    })
  }

  cancel() {
    window.location.reload();
  }

}
