import { Injectable } from '@angular/core';
import { DefectAssignment } from 'src/app/timeline-transport/models/defect-assignment.model';
import { Subject } from 'rxjs';
import { DefectJob } from '../models/defect-job.model';

@Injectable({
  providedIn: 'root'
})
export class TimelineWorkshopStateService {

  $assignmentAdded: Subject<DefectAssignment> = new Subject();
  $dateUpdated: Subject<any> = new Subject();
  $dragDataChanged: Subject<any> = new Subject();
  selectedJobsChanged: Subject<any> = new Subject();
  $jobDeleted:Subject<DefectJob> = new Subject();
  $defectAssignmentUpdated:Subject<DefectAssignment[]> = new Subject();
  $assignmentUpdated: Subject<DefectAssignment> = new Subject();
  constructor() { }
}
