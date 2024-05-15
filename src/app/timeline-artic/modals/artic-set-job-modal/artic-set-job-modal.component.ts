import { Component, OnInit, Input } from '@angular/core';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { catchError, take } from 'rxjs/operators';
import { TimelineArticStateService } from '../../services/timeline-artic-state.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-artic-set-job-modal',
  templateUrl: './artic-set-job-modal.component.html',
  styleUrls: ['./artic-set-job-modal.component.scss']
})
export class ArticSetJobModalComponent implements OnInit {
  @Input()
  job: Job = new Job();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(
    private jobService: JobService,
    private articStateService: TimelineArticStateService,
    private modalService:ModalService
  ) { }

  ngOnInit(): void {

  }

  save(){
    this.jobService.createJob(this.job)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save job');
      return e;
    }))
    .pipe(take(1))
    .subscribe(()=>{
      this.articStateService.$articOrderAdded.next();
      this.reset();
      this.modalService.close('jobTimeSet');
    })
  }

  cancel() {
    this.reset();
    this.modalService.close('jobTimeSet');
  }

  reset() {
    this.job = new Job();
    this.isError = false;
    this.isServerError = false;
  }

}
