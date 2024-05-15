import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { TimelineTransportStateService } from '../../services/timeline-transport-state.service';
import { AddJobValidatorService } from '../../validators/add-job-validator.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-timeline-transport-edit-job',
  templateUrl: './timeline-transport-edit-job.component.html',
  styleUrls: ['./timeline-transport-edit-job.component.scss']
})
export class TimelineTransportEditJobComponent implements OnInit {

  selectedJobs: Job[] = [];
  qty: number = -1;
  time: string = '';
  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private timelineTransportStateService: TimelineTransportStateService,
    private modalService: ModalService,
    private jobService: JobService,
    private addJobValidatorService: AddJobValidatorService) { }

  ngOnInit(): void {
    this.isError = false;
    this.timelineTransportStateService.$transportSelectedJobsChanged.subscribe((jobs: Job[]) => {
      this.selectedJobs = jobs;
    })
  }
  save() {

    this.isError = false;
    if(!this.addJobValidatorService.isValid({ qty: this.qty, time: 'na'} as any)) {
      this.isError = true;
      return;
    }

    this.selectedJobs.forEach((job: Job) => {
      job.qty = this.qty;
      // job.time = this.time;
    });

    this.jobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update jobs please try again later');
      return e;
    }))
    .subscribe(() => {
      this.timelineTransportStateService.$transportSelectedJobsChanged.next([]);
      this.cancel();
    })

  }

  cancel() {
    this.modalService.close('transportJobEditModal');
  }

}
