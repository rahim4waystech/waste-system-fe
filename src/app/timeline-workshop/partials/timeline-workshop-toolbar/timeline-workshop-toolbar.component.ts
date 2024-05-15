import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';
import { TimelineWorkshopStateService } from '../../services/timeline-workshop-state.service';
import { DefectJob } from '../../models/defect-job.model';
import { DefectJobService } from '../../services/defect-job.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-timeline-workshop-toolbar',
  templateUrl: './timeline-workshop-toolbar.component.html',
  styleUrls: ['./timeline-workshop-toolbar.component.scss']
})
export class TimelineWorkshopToolbarComponent implements OnInit {

  date = moment().toDate();
  isDatePickerVisible: boolean = false;

  selectedJobs: DefectJob[] = [];

  constructor(private modalService: ModalService,
    private defectJobService: DefectJobService,
    private timelineWorkshopStateService: TimelineWorkshopStateService) { }

  ngOnInit(): void {
    this.timelineWorkshopStateService.selectedJobsChanged.subscribe((jobs:DefectJob[]) => {
      this.selectedJobs = jobs;
    })
  }


  onStartJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to start');
      return;
    }


    this.selectedJobs.forEach((job: DefectJob) => {

      if(job.started === null || job.started === '') {
        job.started = moment().format('YYYY-MM-DD HH:mm:ss'); //approved
        job.defectStatusId = 3;
        job.defectStatus = {id: 3} as any;
      }
    });

    this.defectJobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update jobs for starting');
      return e;
    }))
    .subscribe((jobs) => {
      alert("Selected jobs have been started");
      this.timelineWorkshopStateService.selectedJobsChanged.next([]);
    })

  }

  onEndJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to end');
      return;
    }

    this.selectedJobs.forEach((job) => {
      if(job.ended === null || job.ended === '') {
        job.ended = moment().format('YYYY-MM-DD HH:mm:ss'); //approved
        job.defectStatusId = 5;
        job.defectStatus = {id: 5} as any;
      }
    });

    this.defectJobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update jobs for ending');
      return e;
    }))
    .subscribe((jobs) => {
      alert("Selected jobs have been ended");
      this.timelineWorkshopStateService.selectedJobsChanged.next([]);
    })

  }

  onDeleteJobClicked() {
    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to delete');
      return;
    }

    this.selectedJobs.forEach((job) => {
      job.deleted = true;
    });

    this.defectJobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update jobs for deleting');
      return e;
    }))
    .subscribe((jobs) => {
      alert("Selected jobs have been deleted");
      this.timelineWorkshopStateService.selectedJobsChanged.next([]);
    })

  }

  openModal(modal: string) {
    this.modalService.open(modal);
  }

  getFormattedDate(): string {
    return moment(this.date).format('dddd MMMM Do YYYY');
  }

  nextDay() {
    this.date = moment(this.date).add(1, 'days').toDate();

    this.timelineWorkshopStateService.$dateUpdated.next(this.date);
  }

  prevDay() {
    this.date = moment(this.date).subtract(1, 'days').toDate();

    this.timelineWorkshopStateService.$dateUpdated.next(this.date);
  }


  onDateSelected($event) {

    // make sure inital setting of value doesn't hide the datepicker
    if(moment(this.date).unix() !== moment($event).unix()) {
      this.isDatePickerVisible = false;
    }

    this.date = $event;

   this.timelineWorkshopStateService.$dateUpdated.next(this.date);
  }

}
