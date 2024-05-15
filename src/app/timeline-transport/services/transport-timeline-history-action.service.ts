import { Injectable } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { TimelineHistoryEvent, TimelineHistoryEventType } from './timeline-transport-history.service';
import { TimelineTransportStateService } from './timeline-transport-state.service';

@Injectable({
  providedIn: 'root'
})
export class TransportTimelineHistoryActionService {

  constructor(private jobService: JobService,
    private timelineTransportStateService: TimelineTransportStateService,
    private jobAssignmentService: JobAssignmentService) { }

  undoAction(event: TimelineHistoryEvent) {
    if(event.type === TimelineHistoryEventType.unapproveJobs) {
      // re-approve as inverse
      this.approveJobs(event);
    }

    if(event.type === <any>TimelineHistoryEventType.approveJobs) {
      this.unApproveJobs(event);
    }

    if(event.type === <any>TimelineHistoryEventType.deleteJobs) {
      this.undeleteJobs(event);
    }

    if(event.type === TimelineHistoryEventType.addUnit) {
      this.deleteUnit(event);
    }

    if(event.type === TimelineHistoryEventType.deleteUnit) {
      this.addUnit(event);
    }

    if(event.type === TimelineHistoryEventType.editUnit) {
      this.editUnit(event);
    }

    if(event.type === TimelineHistoryEventType.addNote) {
      this.revertNote(event);
    }

    if(event.type === TimelineHistoryEventType.addJob) {
      this.deleteJob(event);
    }
  }

  deleteJob(event) {
    let job: Job = event.data;

    job.jobStatusId = 3;
    job.jobStatus = {id: 3} as any;

    this.jobService.updateJob(job)
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not undo last action');
      return e;
    }))
    .subscribe((data: JobAssignment) => {
      alert('job delete have been reverted');
    })
  }

  revertNote(event: TimelineHistoryEvent) {
    let job: Job = event.data;

    job.timelineNotes = '';

    this.jobService.updateJob(job)
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not undo last action');
      return e;
    }))
    .subscribe((data: JobAssignment) => {
      alert('job note have been reverted');
    })
  }

  editUnit(event: TimelineHistoryEvent) {

    // Original data before edit
    let jobAssignment: JobAssignment = event.data;

    this.jobAssignmentService.updateJobAssignment(jobAssignment)
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not undo last action');
      return e;
    }))
    .subscribe((data: JobAssignment) => {
      alert('Unit have been reverted');
      this.timelineTransportStateService.$JobAssignmentChanged.next(jobAssignment);
    })
  }

  addUnit(event: TimelineHistoryEvent) {
    let jobAssignment: JobAssignment = event.data;

    jobAssignment.id = -1;
    this.jobAssignmentService.createJobAssignment(jobAssignment)
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not undo last action');
      return e;
    }))
    .subscribe((data: JobAssignment) => {
      alert('Unit have been reverted');
      jobAssignment.id = data.id;
      this.timelineTransportStateService.$transportJobAssignmentAdded.next(jobAssignment);
    })

  }

  deleteUnit(event: TimelineHistoryEvent) {
    let jobAssignment: JobAssignment = event.data;
    this.jobAssignmentService.deleteJobAssignment(jobAssignment.id)
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not undo last action');
      return e;
    }))
    .subscribe(() => {
      alert('Unit have been reverted');
      this.timelineTransportStateService.$transportJobAssignmentDeleted.next(jobAssignment.id);
    })
  }

  undeleteJobs(event: TimelineHistoryEvent) {

    // This the job state before deleted
    let jobs = event.data.old;
    this.jobService.bulkUpdateJob(jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not undo last action');
      return e;
    }))
    .subscribe(() => {

      event.data.records.forEach((record: any) => {

        // get same record as current from old data to match
        let oldJob: Job = event.data.old.filter(r => r.id === record.id)[0];

        record.jobStatus = oldJob.jobStatusId;
        record.jobStatusId = oldJob.jobStatusId;
      });


      alert('Jobs have been reverted');
    })

  }
  approveJobs(event: TimelineHistoryEvent) {
    let jobs: Job[] = event.data;

    jobs.forEach((job: Job) => {
      job.jobStatusId = {id: 2} as any;
      job.jobStatusId = 2;
    });

    this.jobService.bulkUpdateJob(jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not undo last action');
      return e;
    }))
    .subscribe(() => {
      alert('Jobs have been reverted');
    })


  }

  unApproveJobs(event: TimelineHistoryEvent) {
    let jobs: Job[] = event.data;

    jobs.forEach((job: Job) => {
      job.jobStatusId = {id: 1} as any;
      job.jobStatusId = 1;
    });

    this.jobService.bulkUpdateJob(jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not undo last action');
      return e;
    }))
    .subscribe(() => {
      alert('Jobs have been reverted');
    })


  }

}
