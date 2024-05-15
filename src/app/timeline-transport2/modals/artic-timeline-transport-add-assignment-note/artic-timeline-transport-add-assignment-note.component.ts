import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { TimelineTransportHistoryService } from 'src/app/timeline-transport/services/timeline-transport-history.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';

@Component({
  selector: 'app-artic-timeline-transport-add-assignment-note',
  templateUrl: './artic-timeline-transport-add-assignment-note.component.html',
  styleUrls: ['./artic-timeline-transport-add-assignment-note.component.scss']
})
export class ArticTimelineTransportAddAssignmentNoteComponent implements OnInit {

  jobAssignments: JobAssignment[] = [];
  note: string = '';
  isError: boolean = false;

  constructor(private jobAssignmentService: JobAssignmentService,
    private timelineTransportHistoryService: TimelineTransportHistoryService,
    private timelineTransportStateService: TimelineTransportStateService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.timelineTransportStateService.$transportSelectedJobAssignmentsChanged.subscribe((assignments) => {
      this.note = '';
      this.jobAssignments = assignments;
      assignments.forEach((assignment) => {
        if(assignment.notes !== null && assignment.notes !== '') {
          this.note += assignment.notes + '\n';
        }
      });
    })
  }

  save() {

    // this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.addNote, this.jobs);

    this.jobAssignments.forEach((assignment) => {
      assignment.notes = this.note;
    });

    this.jobAssignmentService.bulkUpdateJobAssignment(JSON.parse(JSON.stringify(this.jobAssignments)))
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not add note to job assignment');
      return e;
    }))
    .subscribe(() => {
      this.timelineTransportStateService.$transportSelectedJobAssignmentsChanged.next([]);
      this.modalService.close('ArtictransportNoteAssignmentCreationModal');
    })
  }
}
