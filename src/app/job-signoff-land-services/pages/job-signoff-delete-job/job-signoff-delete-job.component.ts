import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { TipTicketService } from '../../services/tip-ticket.service';

@Component({
  selector: 'app-job-signoff-delete-job',
  templateUrl: './job-signoff-delete-job.component.html',
  styleUrls: ['./job-signoff-delete-job.component.scss']
})
export class JobSignoffDeleteJobComponent implements OnInit {

  job: Job = new Job();
  constructor(private jobService: JobService,
    private tipTicketService: TipTicketService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadJob(+params['id']);
    })
  }

  loadJob(id: number) {
    this.jobService.getJobById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load job');
      return e;
    }))
    .subscribe((job: Job) => {
      this.job = job;
    })
  }

  onCancelClicked() {
    this.job.jobStatusId = 3;
    this.job.jobStatus = {id: 3} as any;
    this.job.jobManagerSignOff = false;
    this.job.jobSignOffStatusId = -1;

    this.jobService.updateJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not update job');
      return e;
    }))
    .subscribe(() => {
      this.tipTicketService.deleteTicketsByJobId(this.job.id)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('Could not delete tickets');
        return e;
      }))
      .subscribe(() => {
        window.location.href = '/job-signoff/land';
      })

    })
  }
}
