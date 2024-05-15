import { Injectable } from '@angular/core';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { Subject } from 'rxjs';
import { Job } from 'src/app/timeline-skip/models/job.model';

@Injectable({
  providedIn: 'root'
})
export class TimelineTransportStateService {

  $transportJobAssignmentAdded: Subject<JobAssignment> = new Subject();
  $transportJobAssignmentDeleted: Subject<number> = new Subject();
  $transportVorAndAbsenceChanged: Subject<any> = new Subject();
  $JobAssignmentChanged: Subject<JobAssignment> = new Subject();
  $transportDragDataChanged: Subject<any> = new Subject();
  $transportNewJobDialogClosed: Subject<Job> = new Subject();
  $transportSelectedJobsChanged: Subject<Job[]> = new Subject();
  $transportSelectedJobAssignmentsChanged: Subject<JobAssignment[]> = new Subject();
  $transportDateChanged: Subject<any> = new Subject();
  $transportOrderTypeChanged: Subject<number> = new Subject();
  $transportActiveBlockNumberChange: Subject<number> = new Subject();
  $transportJobAssignmentsUpdated: Subject<any> = new Subject();
  $transportCopyDataUpdated: Subject<any> = new Subject();
  $transportOrderIdChanged: Subject<number> = new Subject();
  $transportEditOrderDialogueClosed: Subject<any> = new Subject();
  $transportUnitsChanged: Subject<any> = new Subject();
  $transportJobCopyUnitDialogClosed: Subject<any> = new Subject();


  constructor() { }
}
