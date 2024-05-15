import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { TimelineTransportHistoryService, TimelineHistoryEventType } from 'src/app/timeline-transport/services/timeline-transport-history.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';


@Component({
  selector: 'app-artic-timeline-transport-add-note',
  templateUrl: './artic-timeline-transport-add-note.component.html',
  styleUrls: ['./artic-timeline-transport-add-note.component.scss']
})
export class ArticTimelineTransportAddNoteComponent implements OnInit, OnChanges {

  
  jobs: Job[] = [];
  note: string = '';
  isError: boolean = false;
  constructor(private jobService: JobService,
    private timelineTransportHistoryService: TimelineTransportHistoryService,
    private timelineTransportStateService: TimelineTransportStateService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.timelineTransportStateService.$transportSelectedJobsChanged.subscribe((jobs) => {
      this.note = '';
      this.jobs = jobs;
      jobs.forEach((job) => {
        if(job.timelineNotes !== null && job.timelineNotes !== '') {
          this.note += job.timelineNotes + '\n';
        }
      });
    })
  }

  ngOnChanges(simple: SimpleChanges) {
  }

  save() {

    this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.addNote, this.jobs);

    this.jobs.forEach((job) => {
      job.timelineNotes = this.note;
    });

    this.jobService.bulkUpdateJob(this.jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not add note to job');
      return e;
    }))
    .subscribe(() => {
      this.timelineTransportStateService.$transportSelectedJobsChanged.next([]);
      this.modalService.close('ArtictransportNoteCreationModal');
    })
  }

}
