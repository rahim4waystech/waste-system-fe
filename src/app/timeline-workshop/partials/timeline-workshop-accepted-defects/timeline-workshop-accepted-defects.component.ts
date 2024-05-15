import { Component, OnInit } from '@angular/core';
import { DefectService } from 'src/app/workshop/services/defect.service';
import { take, catchError } from 'rxjs/operators';
import { Defect } from 'src/app/workshop/models/defect.model';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';
import { TimelineWorkshopStateService } from '../../services/timeline-workshop-state.service';
import { DefectAssignment } from 'src/app/timeline-transport/models/defect-assignment.model';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { DefectJob } from '../../models/defect-job.model';
import { DefectJobService } from '../../services/defect-job.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-timeline-workshop-accepted-defects',
  templateUrl: './timeline-workshop-accepted-defects.component.html',
  styleUrls: ['./timeline-workshop-accepted-defects.component.scss']
})
export class TimelineWorkshopAcceptedDefectsComponent implements OnInit {

  date: string = moment().format('YYYY-MM-DD');

  defects: Defect[] = [];

  sortBy: string = 'bookedFor';
  search: string = '';
  draggingId: number = -1;

  currentDefect: Defect = new Defect();

  defectAssignments: DefectAssignment[] = [];
  constructor(private defectService: DefectService,
    private defectJobService: DefectJobService,
    private authService: AuthService,
    private timelineWorkshopStateService: TimelineWorkshopStateService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.loadDefects();

    this.timelineWorkshopStateService.$dateUpdated.subscribe((date: Date) => {
      this.date = moment(date).format('YYYY-MM-DD');

      this.loadDefects();
    })

    this.timelineWorkshopStateService.$defectAssignmentUpdated.subscribe((assignments: DefectAssignment[]) => {
      this.defectAssignments = assignments;
    })
  }

  loadDefects() {
    this.defectService.getAllDefectsByDateForTimeline(this.date, this.search, this.sortBy)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load defects for date');
      return e;
    }))
    .subscribe((data) => {
      this.defects = <Defect[]>data;
    });
  }

  openModal(modal: string) {
    this.modalService.open(modal);
  }

  dragStart(event, defect: Defect) {
    this.draggingId = defect.id;
    this.timelineWorkshopStateService.$dragDataChanged.next({type: 'defectDrop', data: defect});
  }

  dragEnd(event) {
     this.draggingId = -1;
  }

  signOffDefect(defect: Defect) {
    if(confirm('Are you sure you want to signoff this defect? All defect jobs will be ended?')) {
      const user = this.authService.getUser();
      defect.finalSignoff = user.firstName + ' ' + user.lastName;
      defect.signoffDate = moment().format('YYYY-MM-DD HH:mm:ss');
      defect.ended = moment().format('YYYY-MM-DD HH:mm:ss');


      let defectJobsToUpdate = [];
      this.defectAssignments.forEach((assignment: DefectAssignment) => {
        const jobs = assignment.defects.filter(d => d.defectId === defect.id);

        defectJobsToUpdate = defectJobsToUpdate.concat(jobs);
      });

      defectJobsToUpdate.forEach((defectJob: DefectJob) => {
        defectJob.ended = defect.ended;
      });

      this.defectService.saveDefect(defect)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('could not update defect');
        return e;
      }))
      .subscribe(() => {

        if(defectJobsToUpdate.length === 0) {
          alert('Defect has been signed off');
          this.defects = this.defects.filter(d => d.id !== defect.id);
          return;
        }

        // update the defect jobs
        this.defectJobService.bulkUpdateJob(defectJobsToUpdate)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not update defect jobs')
          return e;
        }))
        .subscribe(() => {
          alert('Defect has been signed off');
          this.defects = this.defects.filter(d => d.id !== defect.id);
        })
      })

    }
  }

}
