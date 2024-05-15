import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SkipRoundService } from '../../services/skip-round.service';
import { SkipRound } from '../../models/skip-round.model';
import { catchError, take } from 'rxjs/operators';
import { SkipTimelineStateService } from '../../services/skip-timeline-state.service';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';
import { JobAssignment } from '../../models/job-assignment.model';
import { JobAssignmentService } from '../../services/job-assignment.service';
import { Job } from '../../models/job.model';
import { Order } from 'src/app/order/models/order.model';
import { JobService } from '../../services/job.service';
import { OrderService } from 'src/app/order/services/order.service';
import { Unit } from 'src/app/order/models/unit.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { DefectService } from 'src/app/workshop/services/defect.service';
import { DriverJobMovement } from 'src/app/pods/models/driver-job-movement.model';
import { PodService } from 'src/app/pods/services/pod.service';
import {getHtmlHeadTagElement} from '@angular/cdk/schematics';

@Component({
  selector: 'app-timeline-skip-main',
  templateUrl: './timeline-skip-main.component.html',
  styleUrls: ['./timeline-skip-main.component.scss']
})
export class TimelineSkipMainComponent implements OnInit {

  skipRounds: SkipRound[] = [];
  jobAssignment: JobAssignment[] = [];
  units: Unit[] = [];

  @Input()
  date: string;

  vehicleTypeId = -1;

  currentSkipRound: SkipRound = new SkipRound();
  currentJobAssignment: JobAssignment = new JobAssignment();

  currentHoveringRoundId = -1;
  currentHoveringJob = -1;

  selectedJobs: Job[] = [];

  dragData: any = {};

  draggingId = -1;
  movetoLocation = 0; // Defaut drop position

  isSubcontractorsVisible = true;

  pods: DriverJobMovement[] = [];

  currentPod: DriverJobMovement = new DriverJobMovement();
  dragStartMousePosition: any;

  _el: any = null;



  constructor(private skipRoundService: SkipRoundService,
              private podService: PodService,
              private JobAssignmentService: JobAssignmentService,
              private jobService: JobService,
              private orderService: OrderService,
              private defectService: DefectService,
              private modalService: ModalService,
              private skipTimelineStateService: SkipTimelineStateService) { }

  ngOnInit(): void {
    this.loadSkipRounds();
    this.loadUnits();

    setInterval(() => {
      // resize left and right arrows to be full height
      this.resizeButtons();
    }, 300);

    // When modal is used to add a skip round
    this.skipTimelineStateService.$skipRoundAdded.subscribe((round: SkipRound) => {
      this.skipRounds.push(round);
    });

    this.skipTimelineStateService.$skipJobAssignmentAdded.subscribe((jobAssignment: JobAssignment) => {
      this.jobAssignment.push(jobAssignment);
    });

    // When modal is used to edit skip
    this.skipTimelineStateService.$skipRoundChanged.subscribe((round: SkipRound) => {
      const index = this.skipRounds.findIndex(r => r.id === round.id);

      this.skipRounds[index] = round;
    });

    // When modal is used to edit skip
    this.skipTimelineStateService.$skipJobAssignmentChanged.subscribe((assignment: JobAssignment) => {
      const index = this.jobAssignment.findIndex(ja => ja.id === assignment.id);

      this.jobAssignment[index] = assignment;
    });

    // Date was changed.
    this.skipTimelineStateService.$skipDateChanged.subscribe((date: Date) => {
      this.date = moment(date).format('YYYY-MM-DD');
      this.loadSkipRounds();
    });

    // Date was changed.
    this.skipTimelineStateService.$skipVehicleTypeChanged.subscribe((typeId: number) => {
      this.vehicleTypeId = typeId;
      this.loadSkipRounds();
    });

    this.skipTimelineStateService.$skipDragDataChanged.subscribe((data) => {
      this.dragData = data;
    });

    this.skipTimelineStateService.$skipSubcontractorToggleChanged.subscribe((data) => {
      this.isSubcontractorsVisible = data;


      this.loadSkipRounds();
    });

    this.jobService.subscribeToClientEvents().subscribe((job: Job) => {

      const assignment = this.jobAssignment.filter(ja => ja.id === job.jobAssignmentId)[0];

      const jobIndex = assignment.jobs.findIndex(j => j.id === job.id);

      if (jobIndex <= 0) {
        assignment.jobs.push(job);
      } else {
        assignment.jobs[jobIndex] = job;
      }
    });

    this.skipTimelineStateService.$skipTimelineSelectedJobsChanged.subscribe((data) => {
      this.selectedJobs = data;
    });

  }

  scrollLeft() {
    document.getElementById('timelineskipmain').scrollLeft -= 40;
  }

  scrollRight() {
    document.getElementById('timelineskipmain').scrollLeft += 40;
  }
  loadPODs() {
    this.podService.getByPodsByDate(this.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('Could not load pods');
      return e;
    }))
    .subscribe((pods: any) => {
      this.pods = pods;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
     if (window.pageYOffset > 200) {
      document.querySelectorAll('.roundHeader').forEach(x=>x.classList.add('sticky'));
      document.querySelectorAll('.roundHeader').forEach((x:HTMLElement)=>x.style.top = (window.pageYOffset - 220) + 'px');
      document.getElementById('leftArrow').style.top = (window.pageYOffset + 100) + 'px';  
      document.getElementById('rightArrow').style.top = (window.pageYOffset + 100) + 'px'; 
      document.getElementById('dateSelector').style.display = 'none';
      document.getElementById('vehicleSelector').style.display = 'none';

     } else {
      document.querySelectorAll('.roundHeader').forEach(x=>x.classList.remove('sticky'));
      document.querySelectorAll('.roundHeader').forEach((x:HTMLElement)=>x.style.top = "");
      document.getElementById('dateSelector').style.display = 'block';
      document.getElementById('vehicleSelector').style.display = 'block';
 
    }
  }


  loadUnits() {
    this.orderService.getAllUnits()
      .pipe(take(1))
      .pipe(catchError((e) => {
        if (e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not load units');
        return e;
      }))
      .subscribe((data: Unit[]) => {
        this.units = data;
      });
  }

  loadJobAssignment() {
    this.JobAssignmentService.getAllJobAssignmentByDate(this.date)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if (e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not load job assignment for date');
        return e;
      }))
      .subscribe((assignments: JobAssignment[]) => {
        this.jobAssignment = assignments;

        // then create this is a round added on a previous day
        const newassignments = [];

        // check if skip round has job assignment object
        this.skipRounds.forEach((round: SkipRound) => {
          const ja = this.jobAssignment.filter(ja => ja.skipRoundId === round.id)[0];


          if (!ja) {
            const assignment: JobAssignment = {
              id: -1,
              date: moment(this.date).format('YYYY-MM-DD'),
              depot: { id: round.depotId },
              depotId: round.depotId,
              driverStartTime: round.driverStartTime,
              driver: { id: round.driverId },
              driverId: round.driverId,
              name: round.name,
              skipRoundId: round.id,
              slotNumber: -1,
              subcontractor: { id: round.subcontractorId },
              subcontractorId: round.subcontractorId,
              trailer: { id: -1 },
              trailerId: -1,
              vehicle: new Vehicle(),
              vehicleId: round.vehicleId,
            } as JobAssignment;
            assignment.vehicle.id = round.vehicleId;

            newassignments.push(assignment);

          }
        });

        if (newassignments.length > 0) {
          this.JobAssignmentService.bulkCreateJobAssignment(newassignments)
            .pipe(take(1))
            .pipe(catchError((e) => {
              if (e.status === 403 || e.status === 401) {
                return e;
              }
              alert('could not create job assignment');
              return e;
            }))
            .subscribe((data) => {
             this.jobAssignment = this.jobAssignment.concat(data);
             this.loadJobs();
            });
      }

        else {
          this.loadJobs();
        }
      });
  }

  loadJobs() {
    this.jobService.getJobsByDate(this.date)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if (e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Jobs could not be loaded');
        return e;
      }))
      .subscribe((jobs: Job[]) => {
        // setup jobs to allocations
        this.jobAssignment.forEach((assignment) => {
          assignment.jobs = jobs.filter(j => j.jobAssignmentId === assignment.id);
        });
      });
  }
   blockDragOver(e, blocki) {


    // don't do sorting if column jump
    if(this._el !== null && Array.from(e.target.classList).indexOf('orderContainer') !== -1) {
      const droppedSkipRoundId = e.target.dataset.skiproundid;
      const currentSkipRoundId = this._el.dataset.skiproundid;

      if(droppedSkipRoundId !== currentSkipRoundId || (!currentSkipRoundId && !droppedSkipRoundId)) {
        return;
      }
    }

    this.currentHoveringJob = blocki;
    if (this.isBefore(this._el, e.target))
      e.target.parentNode.insertBefore(this._el, e.target);
    else
      e.target.parentNode.insertBefore(this._el, e.target.nextSibling);
  }
  
  
  isBefore(el1, el2) {
    if (el2.parentNode === el1.parentNode)
      for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
        if (cur === el2)
          return true;
    return false;
  }
  loadSkipRounds() {
    this.skipRoundService.getAllSkipRoundsByDateAndVehicleType(this.date, this.vehicleTypeId)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if (e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not load skip rounds for date');
        return e;
      }))
      .subscribe((data: SkipRound[]) => {
        this.skipRounds = data;

        if (!this.isSubcontractorsVisible) {
          this.skipRounds = this.skipRounds.filter(sr => sr.vehicleId !== -1);
        }

        this.skipRounds.forEach(round => {
          this.defectService.upcomingDateCheck(round.vehicleId)
          .pipe(take(1))
          .pipe(catchError((e) => {
            if (e.status === 403 || e.status === 401) {
              return e;
            }
            alert('Could not check inspection dates');
            return e;
          }))
          .subscribe((dates: any) => {
            if (dates.length !== 0){
              round.upcomingInspection = moment(dates[0].bookedFor, 'YYYY-MM-DD').format('DD/MM/YYYY');
            }
          });
        });

        this.loadJobAssignment();

      });
  }


  openEditRoundModal(round: SkipRound) {
    this.currentSkipRound = round;

    this.currentJobAssignment = this.jobAssignment.filter(ja => ja.skipRoundId === round.id)[0];

    if (!this.currentJobAssignment) {
      alert('Could not open edit round model without assignment object');
      return;
    }
    this.modalService.open('skipRoundEditModal');
  }

  onOrderDrop($event) {
    
    let isReorder = false;

    this.currentHoveringJob = -1;

    if(this._el !== null && Array.from($event.target.classList).indexOf('orderContainer') !== -1) {
      const droppedSkipRoundId = $event.target.dataset.skiproundid;
      const currentSkipRoundId = this._el.dataset.skiproundid;

      if(droppedSkipRoundId === currentSkipRoundId) {
        isReorder = true;
      }
    }

    if (this.dragData.type === 'orderDrop') {
      this.newJobProcess($event);
    } else if (this.dragData.type === 'jobDrop' && !isReorder) {
      this.moveJobProcess($event);
    }  else if(isReorder) {
    //   // save the new order of the jobs

      const jobElements = $event.target.parentElement.children;

      const skipRoundId = jobElements[0].getAttribute('data-skipRoundId');

      const jobAssignment = this.jobAssignment.filter(ja => ja.skipRoundId === +skipRoundId)[0];

      const newJobs = [];
      let count = 0;
      for(var i in jobElements) {
        if(typeof jobElements[i] === 'object') {
          const jobElement = jobElements[i];

          const id = +jobElement.getAttribute('data-jobId');

       
          
          const job = jobAssignment.jobs.filter(j => j.id === id)[0];

        
          if(job) {
            const copyJob = JSON.parse(JSON.stringify(job));
            copyJob.blockNumber = count;

            newJobs.push(copyJob);
          }
          count++;
        }
      }


      this.jobService.bulkUpdateJob(newJobs)
      .pipe(take(1))
      .pipe(catchError((e) => {
        alert('could not update jobs');
        return e;
      }))
      .subscribe(() => {
        jobAssignment.jobs = newJobs;
        this.currentHoveringJob = -1;
      });

      
     }

    $event.currentTarget.classList.remove('dragover');
    this.dragData = null;
    this.currentHoveringRoundId = -1;


  }

  moveJobProcess($event) {

  
    const job: Job = this.dragData.data;
    const currentAssignment = this.jobAssignment.filter(ja => ja.id === job.jobAssignmentId)[0];

    //if (!currentAssignment || this.dragData.data.id <= 0) {
     // alert('cannot move job without valid current assignment and job data');
     // return;
    //}

    const skipRoundId = +$event.srcElement.dataset.id;

    const assignment = this.jobAssignment.filter(ja => ja.skipRoundId === skipRoundId)[0];

    //if (!assignment || this.dragData.data.id <= 0) {
     // alert('cannot move job without valid assignment and order data');
   //   return;
    //}


    // job.jobAssignment.id = assignment.id;
    job.jobAssignmentId = assignment.id;

    // Handle collection order
    if ($event.pageY > this.dragStartMousePosition){
      job.collectionOrder = this.movetoLocation ;
    } else {
      job.collectionOrder = this.movetoLocation - 1;
    }
     // Always place before the job

    // Update all jobs


    this.jobService.updateJob(job)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if (e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Cannot update job. Please try again later.');
        return e;
      }))
      .subscribe((data: Job) => {
        // add job to db
        currentAssignment.jobs = currentAssignment.jobs.filter(j => j.id !== job.id);
        assignment.jobs.push(job);
        this.jobService.sendJobChangeToClients(data);
        this.skipTimelineStateService.$skipReloadAcceptedJobs.next(true);
      });
  }

  newJobProcess($event) {

    const skipRoundId = +$event.srcElement.dataset.id;

    const assignment = this.jobAssignment.filter(ja => ja.skipRoundId === skipRoundId)[0];

    if (!assignment || this.dragData.data.id <= 0) {
      alert('Can\'t create new job without valid assignment and order data');
      return;
    }

    this.dragData.data.orderAllocated = true;


    const job = new Job();
    job.id = -1;
    job.date = this.date;
    job.jobStatus.id = 1; // pending
    job.jobStatusId = job.jobStatus.id;
    job.qty = 1; // order qty
    job.time = this.dragData.data.time;
    job.blockNumber = -1;
    job.order = JSON.parse(JSON.stringify(this.dragData.data));
    job.orderId = job.order.id;
    job.jobAssignmentId = assignment.id;
    job.jobAssignment = JSON.parse(JSON.stringify(assignment));


    const order = JSON.parse(JSON.stringify(this.dragData.data));

    if (!assignment.jobs) {
      assignment.jobs = [];
    }

    this.jobService.createJob(job)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if (e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Cannot create job. Please try again later.');
        return e;
      }))
      .subscribe((data: Job) => {
        // add job to db
        assignment.jobs.push(data);
        this.jobService.sendJobChangeToClients(data);


        this.updateOrder(order).subscribe(() => {
          this.skipTimelineStateService.$skipReloadAcceptedJobs.next(true);
        });
      });
  }

  resizeButtons() {
    let elements = document.getElementsByClassName('roundContainer');
    let requiredElement: HTMLElement = <any>elements[0];

    // document.getElementById('leftArrow').style.height = requiredElement.clientHeight + 'px';
    // document.getElementById('rightArrow').style.height = requiredElement.clientHeight + 'px';

  }
  dragEnter(event, round: SkipRound) {
    event.currentTarget.classList.add('dragover');
    this.currentHoveringRoundId = round.id;
  }


  dragLeave(event) {
    event.currentTarget.classList.remove('dragover');
    this.currentHoveringRoundId = -1;
  }

  getJobsForSkipRound(skipRoundId: number) {
    if (!skipRoundId || skipRoundId === -1) {
      return [];
    }

    const assignment = this.jobAssignment.filter(ja => ja.skipRoundId === skipRoundId)[0];

    if (!assignment) {
      return [];
    }
    return assignment.jobs;

  }


  getAddressForOrder(order: Order): string {
    let address = '';

    if (order.site.name.trim() !== '') {
      address += ',' + order.site.name;
    }

    if (order.site.shippingAddress1.trim() !== '') {
      address += ',' + order.site.shippingAddress1;
    }

    if (order.site.shippingAddress2.trim() !== '') {
      address += ',' + order.site.shippingAddress2;
    }

    if (order.site.shippingCity.trim() !== '') {
      address += ',' + order.site.shippingCity;
    }

    if (order.site.shippingCountry.trim() !== '') {
      address += ',' + order.site.shippingCountry;
    }

    if (order.site.shippingPostCode.trim() !== '') {
      address += ',' + order.site.shippingPostCode;
    }

    return address.substring(1);
  }

  getUnitById(unitId): Unit {
    if (!unitId || unitId <= 0) {
      throw new Error('getUnitById must have a valid error');
    }

    const unit = this.units.filter(u => u.id === unitId)[0];

    return !unit ? new Unit() : unit;
  }

  getColourForJobStatus(job: Job) {
    const statusId = job.jobStatusId;

    // if it has a tip issue and it's resolved make it red
    if (this.hasTipIssue(job.id)) {
      if (!this.getTipDetails(job.id).resolved) {
        return '#c0392b';
      }

    }
    switch (statusId) {
      case 1: // pending
        return '#bdc3c7';

      case 2: // approved
        return '#27ae60';

      case 4: // Sign off
        return '#9b59b6';

      case 5:
        return '#2980b9';

      default:
        return '#bdc3c7';
    }
  }

  onJobCheckboxClicked($event, job: Job) {

    if ($event.target.checked) {
      this.selectedJobs.push(job);
    } else {
      this.selectedJobs = this.selectedJobs.filter(j => j.id !== job.id);
    }

    this.skipTimelineStateService.$skipTimelineSelectedJobsChanged.next(this.selectedJobs);
  }

  getCountForSkipRound(skipRoundId): number {
    const assignment = this.jobAssignment.filter(ja => ja.skipRoundId === skipRoundId)[0];

    return !assignment?.jobs ? 0 : assignment.jobs.filter(j => j.jobStatusId !== 3).length;
  }

  dragStart(event, job: Job) {
    this.dragStartMousePosition = event.pageY;
    this.draggingId = job.id;
    this._el = event.target; 
    this.skipTimelineStateService.$skipDragDataChanged.next({ type: 'jobDrop', data: job });
  }

  dragEnd(event) {
    this.draggingId = -1;
  }

  isCheckBoxSelected(jobId: number): boolean {
    return this.selectedJobs.filter(sj => sj.id === jobId).length > 0;
  }

  getGrade(order: Order): string {
    return !order.grade ? 'N/A' : order.grade.name;
  }

  getTypeOfSkip(order: Order): string {
    return !order.containerType ? 'N/A' : order.containerType.name;
  }

  updateOrder(order: Order) {
    return this.orderService.updateOrder(order)
      .pipe(take(1))
      .pipe(catchError((e) => {
        alert('Could not update order. Please try again later');
        return e;
      }));
  }

  getContact(unit){
    if (unit.driver !== null){
      return unit.driver.contact;
    } else {
      return 'n/a';
    }
  }

  getTipIssue(id: number= -1) {
    const status = ['N/A', 'Empty', 'Overloaded', 'No-one on site to sign', 'Cannot access Container', 'Cannot access Site', 'Incorrect Material', 'Vehicle Issue'];

    return status[id] ? status[id] : 'N/A';
  }

  hasTipIssue(jobId: number) {

    let hasIssue = false;

    this.pods.forEach((pod: DriverJobMovement) => {
      if (pod.jobId === jobId && pod.reportTipIssueId !== -1 && pod.reportTipIssueId) {
        hasIssue = true;
      }
    });

    return hasIssue;
  }

getTipDetails(jobId: number) {

  let pod = new DriverJobMovement();

  this.pods.forEach((currentPod: DriverJobMovement) => {
    if (currentPod.jobId === jobId && pod.reportTipIssueId !== -1 && currentPod.reportTipIssueId) {
      pod = currentPod;
    }
  });

  return {issue: this.getTipIssue(pod.reportTipIssueId), resolved: pod.tipIssueResolved, resolution: pod.tipIssueResolution};

}

getPodForJob(jobId: number) {
  let pod = new DriverJobMovement();

  this.pods.forEach((currentPod: DriverJobMovement) => {
    if (currentPod.jobId === jobId && pod.reportTipIssueId !== -1 && currentPod.reportTipIssueId) {
      pod = currentPod;
    }
  });

  return pod;

}

onIssueResolvedClicked(job: Job) {

  this.currentPod = this.getPodForJob(job.id);
  this.modalService.open('skipResolveIssueModal');
}

  getDriverStatus(id: number= -1) {
    const status = ['N/A', 'Pending', 'On Way', 'On Site', 'To Tip', 'Driver Completed'];

    return status[id] ? status[id] : 'N/A';
  }

    getJobById(jobId: number) {


      let job = new Job();

      this.jobAssignment.forEach((ja) => {
        ja.jobs.forEach((jobItem) => {
          if (jobItem.id === jobId) {
            job = jobItem;
          }
        });
      });


      if (!job) {
        return null;

        // was deleted
        if (job.jobStatusId === 3) {
          return null;
        }

        return job;


      }
    }

ondragover(event: any, collectionOrder){
// COmpatre coords on

    // if (event.target.id == null) {
    //   this.movetoLocation = 0;
    // }
    // else {
      this.movetoLocation = event.target.id;
    // }
  }
}
