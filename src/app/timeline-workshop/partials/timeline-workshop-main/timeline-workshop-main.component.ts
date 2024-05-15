import { Component, OnInit } from '@angular/core';
import { DefectAssignmentService } from '../../services/defect-assignment.service';
import { DefectService } from 'src/app/workshop/services/defect.service';
import { take, catchError } from 'rxjs/operators';
import { Defect } from 'src/app/workshop/models/defect.model';
import { DefectAssignment } from 'src/app/timeline-transport/models/defect-assignment.model';
import { TimelineWorkshopStateService } from '../../services/timeline-workshop-state.service';
import * as moment from 'moment';
import { DefectJob } from '../../models/defect-job.model';
import { DefectJobService } from '../../services/defect-job.service';
import { threadId } from 'worker_threads';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-timeline-workshop-main',
  templateUrl: './timeline-workshop-main.component.html',
  styleUrls: ['./timeline-workshop-main.component.scss']
})
export class TimelineWorkshopMainComponent implements OnInit {

  date: string = moment().format('YYYY-MM-DD');
  defectJobs: DefectJob[] = [];
  defectAssignments: DefectAssignment[] = [];

  emptySlots: number = 3;
  currentHoveredEmptySlot: number = 0;

  dragData: any = {};

  selectedJobs: DefectJob[] = [];

  currentAssignment: DefectAssignment = new DefectAssignment();

  constructor(private defectAssignmentService: DefectAssignmentService,
    private timelineWorkshopStateService: TimelineWorkshopStateService,
    private modalService: ModalService,
    private defectJobService: DefectJobService,
    private defectService: DefectService) { }

  ngOnInit(): void {
    this.loadDefects();

    this.timelineWorkshopStateService.$assignmentAdded.subscribe((assignment: DefectAssignment) => {
      this.defectAssignments.push(assignment);
      this.timelineWorkshopStateService.$defectAssignmentUpdated.next(this.defectAssignments);
    })

    this.timelineWorkshopStateService.$assignmentUpdated.subscribe((assignment: DefectAssignment) => {
      const index = this.defectAssignments.findIndex(da => da.id === assignment.id);
      this.defectAssignments[index] = assignment;

      this.timelineWorkshopStateService.$defectAssignmentUpdated.next(this.defectAssignments);
    })

    this.timelineWorkshopStateService.selectedJobsChanged.subscribe((jobs:DefectJob[]) => {
      this.selectedJobs = jobs;
    })

    this.timelineWorkshopStateService.$dragDataChanged.subscribe((data: any) => {
      this.dragData = data;
    })

    this.timelineWorkshopStateService.$dateUpdated.subscribe((date: Date) => {
      this.date = moment(date).format('YYYY-MM-DD');
      this.loadDefects();
    })
  }

  loadDefects() {
    this.defectJobService.getAllDefectJobsForDate(this.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load defect jobs');
      return e;
    }))
    .subscribe((jobs: DefectJob[]) => {
      this.defectJobs = jobs;

      this.loadDefectAssignments();
    })
  }

  loadDefectAssignments() {
    this.defectAssignmentService.getAllDefectAssignmentByDate(this.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load defect assignments for date');
      return e;
    }))
    .subscribe((assignments: DefectAssignment[]) => {
      this.defectAssignments = assignments;
      this.AssignJobsToAssignment();
    })
  }

  onDefectDrop($event:any, blockId: number, defectAssignmentId: number) {

    if(this.dragData.type === 'defectDrop') {
      this.newJobFromDefect($event, blockId, defectAssignmentId);
    } else {
      // jobdrop
      // this.moveJobToBlankSpace($event, blockId, jobAssignmentId);
    }

  }

  newJobFromDefect($event, blockId, defectAssignmentId) {
      if(blockId === undefined || blockId === null || blockId === -1) {
        alert('Must have a valid blockid to drop job');
        return;
      }


      if(!defectAssignmentId || defectAssignmentId === -1) {
        alert('Must have a valid defectAssignmentId to drop job');
        return;
      }

      const defectAssignment = this.defectAssignments.filter(ja => ja.id === defectAssignmentId)[0];

      if(!defectAssignment) {
        alert('Cannot add job without valid defect assignment');
        return;
      }

      const defect = this.dragData.data;
      if(defectAssignment.defects.filter(f=>f.defectId === defect.id).length === 0){
        if(!defect) {
          alert('Could not create job no data found during drag');
          return;
        }

        const job = new DefectJob();
        job.blockNumber = blockId;
        job.date = moment(this.date).format('YYYY-MM-DD');
        job.defectAssignmentId = defectAssignmentId;
        job.defectId= defect.id;
        job.defectStatusId = 2;
        job.defectStatus = {id: 2} as any;



        // add the now then do db calls
        this.defectJobService.createDefectJob(job)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not save defect job');
          return e;
        }))
        .subscribe((newJob: DefectJob) => {
          defectAssignment.defects.push(newJob);
          this.timelineWorkshopStateService.$defectAssignmentUpdated.next(this.defectAssignments);

          // Update started on main defect
          if(defect.started === '' || defect.started === null) {
            defect.started = moment().format('YYYY-MM-DD HH:mm:ss');
            this.defectService.saveDefect(defect)
            .pipe(take(1))
            .pipe(catchError((e) => {
              if(e.status === 403 || e.status === 401) {
                return e;
              }
              alert('Could not update defect');
              return e;
            }))
            .subscribe(() => {

            });
          }
        })
      } else {
        alert('You cannot assign a Job multiple times to the same fitter');
      }
  }


  AssignJobsToAssignment() {


    this.defectJobs.forEach((job: DefectJob) => {
      const assignment = this.defectAssignments.filter(da => da.id === job.defectAssignmentId)[0];

      if(assignment !== undefined) {

        if(assignment.defects === undefined) {
          assignment.defects = [];
        }
        assignment.defects.push(job);
      }
      if(assignment.defects.length > this.emptySlots){this.emptySlots = assignment.defects.length}
    })

    this.timelineWorkshopStateService.$defectAssignmentUpdated.next(this.defectAssignments);
  }
  getEmptySlotAsArray() {
    const arr = [];

    for(let i = 0; i < this.emptySlots; i++) {
      arr[i] = i;
    }

    return arr;
  }


  addEmptySlot() {
    this.emptySlots++;
  }

  dragEnter(event, blocki) {
    event.currentTarget.classList.add('dragover');
    this.currentHoveredEmptySlot = blocki;
  }

  dragLeave(event) {
    event.currentTarget.classList.remove('dragover');
    this.currentHoveredEmptySlot = -1;
  }

  getJobByDefectssignmentIdAndBlockId(defectAssignmentId: number, blockId: number) {

    if(blockId === undefined || blockId === null || blockId === -1) {
      throw new Error('You must supply a valid blockId for getJobByDefectssignmentIdAndBlockId');
    }


    if(!defectAssignmentId || defectAssignmentId === -1) {
      throw new Error('You must supply a valid defectAssignmentId for getJobByDefectssignmentIdAndBlockId');
    }

    const defectAssignment = this.defectAssignments.filter(ja => ja.id === defectAssignmentId)[0];

    if(!defectAssignment) {
      return null;
    }

    if(!defectAssignment.defects) {
      defectAssignment.defects = [];
    }

    const job = defectAssignment.defects.filter(j => j.blockNumber === blockId && !j.deleted)[0];



    if(!job) {
      return null;
    }

    // // was deleted
    if(job.deleted) {
      return null;
    }
    return job;


  }

  onSelectedCheckbox($event, job: DefectJob) {
    if(!$event.target.checked) {
      this.selectedJobs = this.selectedJobs.filter(j => j.id !== job.id);
    } else {
      this.selectedJobs.push(job);
    }

    this.timelineWorkshopStateService.selectedJobsChanged.next(this.selectedJobs);
  }

  isBoxChecked(job: DefectJob) {
    return this.selectedJobs.filter(sj => sj.id === job.id).length > 0;
  }



  isCheckboxActive(job: DefectJob) {
    //TODO: halt on sign off
    return !(job.ended !== null && job.ended !== '');
  }


  deleteDefectAssignment(id: number) {
    if(!id || id === -1) {
      throw new Error('you must provide an id for deleting a allocation');
    }

    const defectAssignment = this.defectAssignments.filter(ja => ja.id === id)[0];

    if(!defectAssignment) {
      alert('Cant find defect assignment cant delete');
      return;
    }

    if(defectAssignment.defects.filter(d => !d.deleted).length > 0) {
      alert('You cant delete an assignment which has jobs');
      return;
    }

    this.defectAssignmentService.deleteDefectAssignment(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not delete the job assignment');
      return e;
    }))
    .subscribe(() => {
      // Remove from job assignments
      this.defectAssignments = this.defectAssignments.filter(ja => ja.id !== id);
      this.timelineWorkshopStateService.$defectAssignmentUpdated.next(this.defectAssignments);
    })


  }

  openModal(modal: string) {
    this.modalService.open(modal);
  }

}
