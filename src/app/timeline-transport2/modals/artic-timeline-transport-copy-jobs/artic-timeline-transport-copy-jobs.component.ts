import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';

@Component({
  selector: 'app-artic-timeline-transport-copy-jobs',
  templateUrl: './artic-timeline-transport-copy-jobs.component.html',
  styleUrls: ['./artic-timeline-transport-copy-jobs.component.scss']
})
export class ArticTimelineTransportCopyJobsComponent implements OnInit {

  date: string = '';
  isError: boolean = false;
  isServerError: boolean = false;

  jobAssignments: JobAssignment[] = [];
  jobs: Job[] = [];
  constructor(private modalService: ModalService,
    private jobAssignmentService: JobAssignmentService,
    private timelineTransportStateService: TimelineTransportStateService,
    private jobService: JobService) { }

  ngOnInit(): void {
    this.timelineTransportStateService.$transportCopyDataUpdated.subscribe((data) => {
      this.jobAssignments = [data[0]];
      this.jobs = data[1];
    })
  }

  save() {
    this.isError = false;
    if(this.date === '') {
      this.isError = true;
    }

    this.jobAssignmentService.copyJobs(this.jobAssignments, this.jobs, this.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not copy jobs to next day');
      return e;
    }))
    .subscribe(() => {
      this.cancel();
    })
    


  }

  cancel() {
    this.date = '';
    this.modalService.close('ArtictransportCopyJobsModal');
  }

}
 