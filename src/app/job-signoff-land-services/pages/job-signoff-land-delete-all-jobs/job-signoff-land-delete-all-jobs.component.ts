import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';

@Component({
  selector: 'app-job-signoff-land-delete-all-jobs',
  templateUrl: './job-signoff-land-delete-all-jobs.component.html',
  styleUrls: ['./job-signoff-land-delete-all-jobs.component.scss']
})
export class JobSignoffLandDeleteAllJobsComponent implements OnInit {

  jobs: Job[] = [];
  jobIds: string[] = [];
  
  constructor(private jobService: JobService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let jobIds = params['ids'].split(',');

      this.jobIds = jobIds;

      this.loadJobs(jobIds);
    })
  }

  loadJobs(jobIds: string[]=[]) {
    this.jobService.getAllJobsByIds(jobIds)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load jobs');
      return e;
    }))
    .subscribe((jobs: Job[]) => {
      this.jobs = jobs;
    });
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
    window.location.href = '/job-signoff/land';
  }

}
