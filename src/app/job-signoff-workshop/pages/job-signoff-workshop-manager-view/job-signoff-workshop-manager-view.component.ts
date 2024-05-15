import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DefectJob } from 'src/app/timeline-workshop/models/defect-job.model';
import { DefectJobService } from 'src/app/timeline-workshop/services/defect-job.service';
import { Defect } from 'src/app/workshop/models/defect.model';
import { DefectService } from 'src/app/workshop/services/defect.service';

@Component({
  selector: 'app-job-signoff-workshop-manager-view',
  templateUrl: './job-signoff-workshop-manager-view.component.html',
  styleUrls: ['./job-signoff-workshop-manager-view.component.scss']
})
export class JobSignoffWorkshopManagerViewComponent implements OnInit {

  defect: Defect = new Defect();
  user: User = new User();
  jobs: DefectJob[] = [];

  constructor(private defectService: DefectService,
    private route: ActivatedRoute,
    private defectJobService: DefectJobService,
    private authService: AuthService) { 
    this.route.params.subscribe((params) => {
      this.loadDefectById(+params['id']);
    })
    
    this.user = this.authService.getUser();

  }

  loadDefectById(defectId: number) {
    this.defectService.getDefectById(defectId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load defect');
      return e;
    }))
    .subscribe((defect: Defect) => {
      this.defect = defect;
      this.loadJobsByDefectId(this.defect.id);
    })
  }

  loadJobsByDefectId(defectId:number) {
    this.defectJobService.getJobsByDefectId(defectId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not get all jobs by defect id');
      return e;
    }))
    .subscribe((jobs: DefectJob[]) => {
      this.jobs = jobs;
    })
  }

  ngOnInit(): void {
  }

  updateJobs() {
    this.jobs.forEach((job: DefectJob) => {
      job.ended = moment().format('YYYY-MM-DD');
      job.defectStatusId = 5;
      job.defectStatus = {id: 5} as any;
    })

    this.defectJobService.bulkUpdateJob(this.jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not update jobs');
      return e;
    }))
    .subscribe(() => {
      window.location.href = '/4workshop/signoff';
    })
  }
  save() {
    this.defect.finalSignoff = this.user.firstName + ' ' + this.user.lastName;
    this.defect.ended = moment().format('YYYY-MM-DD');
    this.defect.signoffDate = moment().format('YYYY-MM-DD');
    this.defectService.saveDefect(this.defect)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not save defect');
      return e;
    }))
    .subscribe((defect: Defect) => {
      if(this.jobs.length > 0) {
        this.updateJobs();
      } else {
        window.location.href = '/4workshop/signoff';
      }
    })
  }

}
