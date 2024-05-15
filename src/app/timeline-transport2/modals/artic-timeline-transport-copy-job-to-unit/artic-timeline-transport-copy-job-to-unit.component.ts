import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';

@Component({
  selector: 'app-artic-timeline-transport-copy-job-to-unit',
  templateUrl: './artic-timeline-transport-copy-job-to-unit.component.html',
  styleUrls: ['./artic-timeline-transport-copy-job-to-unit.component.scss']
})
export class ArticTimelineTransportCopyJobToUnitComponent implements OnInit {

  assignments: JobAssignment[] = [];

  selectedUnit: number = -1;

  @Input()
  job: Job = new Job();

  @Input()
  date: string = moment().format('YYYY-MM-DD');

  constructor(private timelineTransportStateService: TimelineTransportStateService,
    private jobAssignmentService: JobAssignmentService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.timelineTransportStateService.$transportJobAssignmentsUpdated.subscribe((assignments: JobAssignment[]) => {
      this.assignments = assignments;
    })


    this.timelineTransportStateService.$transportDateChanged.subscribe((date) => {
      this.date = moment(date).format('YYYY-MM-DD');

      this.jobAssignmentService.getAllJobAssignmentByDateExpanded(this.date)
      .pipe(take(1))
      .pipe(catchError((e) => {
        alert('could not get assignments for date');
        return e;
      }))
      .subscribe((assignments: JobAssignment[]) => {
        this.assignments = assignments;
      })
    })
  }


  onDateChanged() {
    this.jobAssignmentService.getAllJobAssignmentByDateExpanded(this.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not get assignments for date');
      return e;
    }))
    .subscribe((assignments: JobAssignment[]) => {
      this.assignments = assignments;
    })
  }


  save() {
    if(this.selectedUnit === -1 || this.date === '') {
      alert('You must complete all required fields');
      return;
    }

    let newJob: Job = JSON.parse(JSON.stringify(this.job));
    newJob.jobAssignmentId = this.selectedUnit;
    newJob.jobAssignment = {id: this.selectedUnit} as any;


    // ensure if date changed reflect this on job
    newJob.date = this.date;

    let blockId = -1;

    // calculate highest block no
    const unit = this.assignments.filter(a => a.id === this.selectedUnit)[0];

    unit.jobs.forEach((job: Job) => {

      // if it's not deleted
      if(job.jobStatusId !== 3) {
        if(blockId < job.blockNumber) {
          blockId = job.blockNumber;
        }
      }
    });

    newJob.blockNumber = blockId + 1;

    this.timelineTransportStateService.$transportJobCopyUnitDialogClosed.next(JSON.parse(JSON.stringify(newJob)));
    alert('Job has now been copied');
    this.cancel();
  }

  cancel() {
    this.selectedUnit = -1;
    this.modalService.close('ArtictransportCopyJobToUnitModal');
  }

}
