import { Component, OnInit } from '@angular/core';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { environment } from 'src/environments/environment';
import { DefectService } from 'src/app/workshop/services/defect.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';

@Component({
  selector: 'app-artic-timeline-transport-main-vertical',
  templateUrl: './artic-timeline-transport-main-vertical.component.html',
  styleUrls: ['./artic-timeline-transport-main-vertical.component.scss']
})
export class ArticTimelineTransportMainVerticalComponent implements OnInit {
  jobAssignments: JobAssignment[] = [];
  currentJobAssignment: JobAssignment = new JobAssignment();

  emptySlots: number = 3;

  currentHoveredEmptySlot: number = -1;
  curenntHoveredJob: number = -1;

  orderTypeId: number = 4;

  date: string = moment().format('YYYY-MM-DD');

  dragData: any = {};

  newJob: Job = new Job();

  selectedJobs: Job[] = [];

  constructor(private timelineTransportStateService: TimelineTransportStateService,
    private jobAssignmentService: JobAssignmentService,
    private jobService: JobService,
    private defectService:DefectService,
    private modalService: ModalService) { }

  ngOnInit(): void {


    this.timelineTransportStateService.$transportDateChanged.subscribe((date) => {
      this.date = moment(date).format('YYYY-MM-DD');
      this.loadJobAssignment();
    })

    this.timelineTransportStateService.$transportOrderTypeChanged.subscribe((typeId) => {
      this.orderTypeId = typeId;
      this.loadJobAssignment();
    })

    this.timelineTransportStateService.$transportJobAssignmentAdded.subscribe((assignment: JobAssignment) => {
      this.jobAssignments.push(assignment);
    })

    // When modal is used to edit unit
    this.timelineTransportStateService.$JobAssignmentChanged.subscribe((assignment: JobAssignment) => {
      const index = this.jobAssignments.findIndex(ja => ja.id === assignment.id);

      this.jobAssignments[index] = assignment;
    });

    this.timelineTransportStateService.$transportDragDataChanged.subscribe((data: any) => {
      this.dragData = data;
    });

    // When job dialog is closed
    this.timelineTransportStateService.$transportNewJobDialogClosed.subscribe((job: Job) => {
      const jobAssignment = this.jobAssignments.filter(ja => ja.id === job.jobAssignmentId)[0];

      if(!jobAssignment) {
        alert('Cannot add job without assignment data');
        return;
      }

      this.jobService.createJob(job)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not create job please try again later.');
        return e;
      }))
      .subscribe((data: Job) => {
        job.id = data.id;
        jobAssignment.jobs.push(job);
        this.newJob = new Job();
       // this.loadJobAssignment();
      })
    })

    this.timelineTransportStateService.$transportSelectedJobsChanged.subscribe((jobs: Job[]) => {
      this.selectedJobs = jobs;
    })
    this.loadJobAssignment();

  }

  loadJobAssignment() {
    this.jobAssignmentService.getAllJobAssignmentRoutesByDateByOrderType(this.date, this.orderTypeId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load job assignments');
      return e;
    }))
    .subscribe((assignments: JobAssignment[]) => {
      this.jobAssignments = assignments;

      this.jobAssignments.forEach(round => {
        this.defectService.upcomingDateCheck(round.vehicleId)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not check inspection dates');
          return e;
        }))
        .subscribe((dates:any)=>{
          if(dates.length !== 0){
            round.upcomingInspection = moment(dates[0].bookedFor,'YYYY-MM-DD').format('DD/MM/YYYY');
          }
        })
      })

      this.loadJobs();
      })
  }

  loadJobs() {
    // Hard code to tipper the now
    this.jobService.getJobsByDateForTransport(this.date, this.orderTypeId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load jobs by date for transport');
      return e;
    }))
    .subscribe((jobs: Job[]) => {
      this.jobAssignments.forEach((assignment) => {
        assignment.jobs = jobs.filter(j => j.jobAssignmentId === assignment.id);

        // Make sure right amount of blocks shown
        const maxBlockNumber = Math.max.apply(Math, assignment.jobs.map(function(o) { return o.blockNumber; }));
        if(maxBlockNumber >= this.emptySlots) {
          this.emptySlots = maxBlockNumber + 1;
        }
      })
    });


  }

  deleteJobAssignment(id: number) {
    if(!id || id === -1) {
      throw new Error('you must provide an id for deleting a allocation');
    }

    const jobAssignment = this.jobAssignments.filter(ja => ja.id === id)[0];

    if(!jobAssignment) {
      alert('Cant find job assignment cant delete');
      return;
    }

    if(jobAssignment.jobs.filter(j => j.jobStatusId !== 3).length > 0) {
      alert('You cant delete an assignment which has jobs');
      return;
    }

    this.jobAssignmentService.deleteJobAssignment(id)
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
      this.jobAssignments = this.jobAssignments.filter(ja => ja.id !== id);
    })


  }

  openEditModal(assignment: JobAssignment) {

    this.currentJobAssignment = JSON.parse(JSON.stringify(assignment));

    if (!this.currentJobAssignment) {
      alert('Could not open edit round model without assignment object');
      return;
    }
    this.modalService.open('ArtictransportRowEditModal');
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


  dragEnterJob(event, job: Job) {
    event.currentTarget.classList.add('dragover');
    this.curenntHoveredJob = job.id;
  }

  dragLeaveJob(event, job) {
    event.currentTarget.classList.remove('dragover');
    this.curenntHoveredJob = job.id;
  }

  dragStart(event, job: Job) {
    this.timelineTransportStateService.$transportDragDataChanged.next({type: 'jobDrop', data: job});
  }

  dragEnd(event) {
    //  this.draggingId = -1;
  }

 onOrderDropOnJob($event, blocki, job: Job) {

  if(this.dragData.type === 'jobDrop') {
    this.moveJobOverJob($event, blocki, job);
  } else {
    this.moveOrderOverJob($event, blocki, job);
  }

 }

  onOrderDrop($event:any, blockId: number, jobAssignmentId: number) {

    if(this.dragData.type === 'orderDrop') {
      this.newJobFromOrder($event, blockId, jobAssignmentId);
    } else {
      // jobdrop
      this.moveJobToBlankSpace($event, blockId, jobAssignmentId);
    }

  }

  moveJobOverJob($event, blocki, job: Job) {
        // First remove existing job
  job.jobStatusId = 3;
  job.jobStatus = {id: 3} as any;

  const assignment = this.jobAssignments.filter(ja => ja.id === job.jobAssignmentId)[0];

  if(!assignment) {
    alert("Could not find assignment for current job");
    return;
  }

  this.jobService.updateJob(job)
  .pipe(take(1))
  .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
    alert('Could not update job try again later on');
    return e;
  }))
  .subscribe((data) => {});

  assignment.jobs = assignment.jobs.filter(j => j.id !== job.id);


  const newJob: Job = this.dragData.data;
  newJob.jobAssignmentId = job.jobAssignmentId;
  newJob.jobAssignment = {id: job.jobAssignmentId} as any;
  newJob.blockNumber = job.blockNumber;

  this.jobService.updateJob(newJob)
  .pipe(take(1))
  .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
    alert('Could not update job try again later on');
    return e;
  }))
  .subscribe((data) => {});
  this.newJob = new Job();

  }

  moveOrderOverJob($event, blocki, job: Job) {
      // First remove existing job
  job.jobStatusId = 3;
  job.jobStatus = {id: 3} as any;

  const assignment = this.jobAssignments.filter(ja => ja.id === job.jobAssignmentId)[0];

  if(!assignment) {
    alert("Could not find assignment for current job");
    return;
  }

  this.jobService.updateJob(job)
  .pipe(take(1))
  .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
    alert('Could not update job try again later on');
    return e;
  }))
  .subscribe((data) => {});

  const order = this.dragData.data;

  if(!order) {
    alert('Could not create job no data found during drag');
    return;
  }

  const newjob = new Job();
  newjob.blockNumber = job.blockNumber;
  newjob.date = this.date;
  newjob.jobAssignmentId = assignment.id;
  newjob.jobAssignment.id = assignment.id;
  newjob.jobStatusId = 1;
  newjob.jobStatus.id = 1;
  newjob.orderId = order.id;
  newjob.order = order;

  this.newJob = newjob;

  assignment.jobs = assignment.jobs.filter(j => j.id !== job.id);

  this.modalService.open('ArtictransportJobCreationModal');
  }


  isCheckboxActive(job: Job) {
    if(job.jobStatusId > 3) {
      return false;
    }

    return true;
  }

  moveJobToBlankSpace($event:any, blockId: number, jobAssignmentId: number) {
    const job: Job = this.dragData.data;

      if(!job) {
        alert('cant move job without data');
        return;
      }

      const currentJobAssignment = this.jobAssignments.filter(ja => ja.id === job.jobAssignmentId)[0];

      if(!currentJobAssignment) {
        alert('cant move job without current allocation');
        return;
      }

      const newJobAssignment = this.jobAssignments.filter(ja => ja.id === jobAssignmentId)[0];

      if(!newJobAssignment) {
        alert('cant move job without new allocation');
        return;
      }

      const newJob: Job = JSON.parse(JSON.stringify(job));
      newJob.jobAssignmentId = jobAssignmentId;
      newJob.jobAssignment = new JobAssignment();
      newJob.jobAssignment.id = jobAssignmentId;
      newJob.blockNumber = blockId;

      this.jobService.updateJob(newJob)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not update job please try again later');
        return e;
      }))
      .subscribe(() => {
        // remove from current assignment
        currentJobAssignment.jobs = currentJobAssignment.jobs.filter(j => j.id !== newJob.id);

        //add to new one
        newJobAssignment.jobs.push(newJob);

      })
    }
  newJobFromOrder($event:any, blockId: number, jobAssignmentId: number) {
    if(blockId === undefined || blockId === null || blockId === -1) {
      alert('Must have a valid blockid to drop job');
      return;
    }


    if(!jobAssignmentId || jobAssignmentId === -1) {
      alert('Must have a valid jobAssignmentId to drop job');
      return;
    }

    const jobAssignment = this.jobAssignments.filter(ja => ja.id === jobAssignmentId)[0];

    if(!jobAssignment) {
      alert('Cannot add job without valid job assignment');
      return;
    }

    const order = this.dragData.data;

    if(!order) {
      alert('Could not create job no data found during drag');
      return;
    }

    const job = new Job();
    job.blockNumber = blockId;
    job.date = this.date;
    job.jobAssignmentId = jobAssignmentId;
    job.jobAssignment.id = jobAssignmentId;
    job.jobStatusId = 1;
    job.jobStatus.id = 1;
    job.orderId = order.id;
    job.order = order;

    this.newJob = job;

    this.modalService.open('ArtictransportJobCreationModal');
  }
  getJobByJobAssignmentIdAndBlockId(jobAssignmentId: number, blockId: number) {

    if(blockId === undefined || blockId === null || blockId === -1) {
      throw new Error('You must supply a valid blockId for getJobByJobAssignmentIdAndBlockId');
    }


    if(!jobAssignmentId || jobAssignmentId === -1) {
      throw new Error('You must supply a valid jobAllocationId for getJobByJobAssignmentIdAndBlockId');
    }

    const jobAssignment = this.jobAssignments.filter(ja => ja.id === jobAssignmentId)[0];

    if(!JobAssignment) {
      return null;
    }

    if(!jobAssignment.jobs) {
      jobAssignment.jobs = [];
    }

    const job = jobAssignment.jobs.filter(j => j.blockNumber === blockId && j.jobStatusId !== 3)[0];



    if(!job) {
      return null;
    }

    // was deleted
    if(job.jobStatusId === 3) {
      return null;
    }

    return job;


  }

  getColorCodeForJob(job: Job) {
    let colorCode = '#636e72';

    if(job.jobSignOffStatusId === 4 || job.jobStatusId === 4) {
      colorCode = 'rgb(155, 89, 182)';
    }

    if(job.jobManagerSignOff) {
      colorCode = '#2980b9';
    }

    if(job.jobStatusId === 2) {
      colorCode = 'rgb(39, 174, 96)';
    }

    return colorCode;
  }

  onSelectedCheckbox($event, job: Job) {
    if(!$event.target.checked) {
      this.selectedJobs = this.selectedJobs.filter(j => j.id !== job.id);
    } else {
      this.selectedJobs.push(job);
    }

    this.timelineTransportStateService.$transportSelectedJobsChanged.next(this.selectedJobs);
  }

  isBoxChecked(job: Job) {
    return this.selectedJobs.filter(sj => sj.id === job.id).length > 0;
  }


  onPDFDownload() {

    this.jobService.generateTimelinePDF(this.jobAssignments)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not generate pdf')
      return e;
    }))
    .subscribe((data: any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
    })

 }
  getContact(unit){
    if(unit.driver !== null || !unit.driver){
      return 'n/a';
    }
  }
}
