import { Component, Input, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { DriverJobStatus } from 'src/app/pods/models/driver-job-status.model';

import { PodService } from 'src/app/pods/services/pod.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { ArticRunDiaryStateService } from '../../services/artic-run-diary-state.service';

@Component({
  selector: 'app-artic-run-diary-set-status',
  templateUrl: './artic-run-diary-set-status.component.html',
  styleUrls: ['./artic-run-diary-set-status.component.scss']
})
export class ArticRunDiarySetStatusComponent implements OnInit {

  @Input()
  job: Job = new Job();
  
  isError: boolean = false;
  isServerError: boolean = false;

  driverJobStatues: DriverJobStatus[] = [];
  constructor(private podService: PodService,
    private articRunDiaryStateService: ArticRunDiaryStateService,
    private modalService: ModalService,
    private jobService: JobService) { }

  ngOnInit(): void {
    this.podService.getAllStatuses()
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not load driver status');
      return e;
    }))
    .subscribe((statuses: any) => {
      this.driverJobStatues = statuses;

      this.driverJobStatues.unshift({id: -1, name: 'Not started'} as any);
    })
  }

  onStatusChanged($event) {
    let status = this.driverJobStatues.filter(djs => djs.id = +$event)[0];

    if(status){
      this.job['driverJobStatus'] = status;
      this.job.driverJobStatusId = status.id;
    }
  }

  save() {
    this.jobService.updateJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not save job');
      return e;
    }))
    .subscribe((job: Job) => {
      this.articRunDiaryStateService.$modalClosed.next(true);
      this.modalService.close('articSetStatusModal');
    })
  }

  cancel() {
    this.modalService.close('articSetStatusModal');
  }

}
