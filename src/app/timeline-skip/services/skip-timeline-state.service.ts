import { Injectable } from '@angular/core';
import { SkipRound } from '../models/skip-round.model';
import { Subject } from 'rxjs';
import { JobAssignment } from '../models/job-assignment.model';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class SkipTimelineStateService {

  $skipRoundAdded: Subject<SkipRound> = new Subject();
  $skipRoundChanged: Subject<SkipRound> = new Subject();

  $skipJobAssignmentAdded: Subject<JobAssignment> = new Subject();
  $skipJobAssignmentChanged: Subject<JobAssignment> = new Subject();

  $skipDateChanged: Subject<Date> = new Subject();
  $skipVehicleTypeChanged: Subject<number> = new Subject();

  //When jobs are selected on timeline
  $skipTimelineSelectedJobsChanged: Subject<Job[]> = new Subject();

  // when vor and absence change
  $skipVorAndAbsenceChanged: Subject<any> = new Subject();

  // When dragging is started data will be forwared to this subject to hold access in the compontent.
  $skipDragDataChanged:Subject<any> = new Subject();

  $skipSubcontractorToggleChanged: Subject<any> = new Subject();


  $skipReloadAcceptedJobs: Subject<any> = new Subject();
  constructor() { }
}
