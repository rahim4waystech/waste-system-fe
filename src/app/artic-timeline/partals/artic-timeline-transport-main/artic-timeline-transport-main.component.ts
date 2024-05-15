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
import { Personalisation } from 'src/app/settings/models/personalisation.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';
import { UserSettingsService } from 'src/app/settings/services/user-settings.service';
import { Unit } from 'src/app/order/models/unit.model';
import { OrderService } from 'src/app/order/services/order.service';
import { DriverJobMovement } from 'src/app/pods/models/driver-job-movement.model';
import { PodService } from 'src/app/pods/services/pod.service';
import { Order } from 'src/app/order/models/order.model';
import { forkJoin, Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';
import { JobSignoffLandStateService } from 'src/app/job-signoff-land-services/services/job-signoff-land-state.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { TransportTimeLineSortOrder } from 'src/app/timeline-transport/models/transport-timeline-sort-order';
import { TimelineTransportHistoryService, TimelineHistoryEventType } from 'src/app/timeline-transport/services/timeline-transport-history.service';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';
import { TransportTimelineHistoryActionService } from 'src/app/timeline-transport/services/transport-timeline-history-action.service';
import { TransportTimelineSortOrderService } from 'src/app/timeline-transport/services/transport-timeline-sort-order.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import { TrailerStatus } from 'src/app/timeline-skip/models/trailer-status.model';
import { OrderProvisionService } from 'src/app/order/services/order-provision.service';

declare var $: any;

@Component({
  selector: 'app-artic-timeline-transport-main',
  templateUrl: './artic-timeline-transport-main.component.html',
  styleUrls: ['./artic-timeline-transport-main.component.scss']
})
export class ArticTimelineTransportMainComponent implements OnInit {

  jobAssignments: JobAssignment[] = [];
  currentJobAssignment: JobAssignment = new JobAssignment();

  emptySlots: number = 3;

  currentHoveredEmptySlot: number = -1;
  curenntHoveredJob: number = -1;

  currentOrder: Order = new Order();
  currentJob: Job = new Job();

  orderTypeId: number = 4;
  timelineSettings:Personalisation = new Personalisation();
  user: User = new User();

  date: string = moment().format('YYYY-MM-DD');

  dragData: any = {};

  newJob: Job = new Job();

  pods: DriverJobMovement[] = [];

  selectedJobs: Job[] = [];
  selectedAssignments: JobAssignment[] = [];

  selectedEmptySlots: any[] = [];
  units: Unit[] = [];

  activeBlockI =-1;

  autoPairAttempted: boolean = false;

  copyJob: Job = new Job();

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  trailerStatuses: TrailerStatus[] = [];

  constructor(private timelineTransportStateService: TimelineTransportStateService,
    private jobAssignmentService: JobAssignmentService,
    private jobService: JobService,
    private timelineTransportHistoryService: TimelineTransportHistoryService,
    private transportTimelineHistoryActionService: TransportTimelineHistoryActionService,
    private orderService: OrderService,
    private orderProvisionService: OrderProvisionService,
    private transportTimelineSortOrderService: TransportTimelineSortOrderService,
    private jobSignoffLandStateService: JobSignoffLandStateService,
    private podService: PodService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private userSettingsService: UserSettingsService,
    private authService:AuthService,
    private defectService:DefectService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    // TODO


    this.userSettingsService.getSettingsByUserId(this.user.id)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get timeline settings');
      return e;
    }))
    .pipe(take(1))
    .subscribe((timelineSetting:any) => {
      if(timelineSetting.length !== 0){
        this.timelineSettings = timelineSetting[0];
      } else {
        this.timelineSettings = new Personalisation();

        this.timelineSettings.userId = this.user.id;
        this.userSettingsService.createPersonalisation(this.timelineSettings)
        .pipe(catchError((e)=>{
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not add Orientation settings');
          return e;
        }))
        .pipe(take(1))
        .subscribe((settings:Personalisation)=>{
          this.timelineSettings = settings;
        })
      }
    })

    this.timelineTransportStateService.$transportJobAssignmentDeleted.subscribe((jobAssignmentId: number) => {
      this.jobAssignments = this.jobAssignments.filter(ja => ja.id !== jobAssignmentId);
    });

    this.jobSignoffLandStateService.$editJobDialogClosed.subscribe(() => {
      this.loadJobAssignment();
    })

    this.timelineTransportStateService.$transportEditOrderDialogueClosed.subscribe(() => {
      this.loadJobAssignment();
    })

    this.timelineTransportStateService.$transportDateChanged.subscribe((date) => {
      this.date = moment(date).format('YYYY-MM-DD');
      this.autoPairAttempted = false;
      this.loadJobAssignment();
    })

    this.timelineTransportStateService.$transportOrderTypeChanged.subscribe((typeId) => {
      this.orderTypeId = typeId;
      this.autoPairAttempted = false;
      this.loadJobAssignment();
    })

    this.timelineTransportStateService.$transportJobAssignmentAdded.subscribe((assignment: JobAssignment) => {
      // set slot id to next in seq
      let slotId = -1;

      // Set next in seq for id
      this.jobAssignments.forEach((assignment) => {
        if(assignment.slotNumber > slotId) {
          slotId = assignment.slotNumber;
        }
      })


      assignment.slotNumber = slotId + 1;

      // this.jobAssignmentService.updateJobAssignment(assignment)
      // .pipe(take(1))
      // .pipe(catchError((e) => {
      //   if(e.status === 403 || e.status === 401) {
      //     return e;
      //   }
      //   alert('could not update assignment')
      //   return e;
      // }))
      // .subscribe(() => {
      //   this.jobAssignments.push(assignment);
      // })
      this.loadJobAssignment();
    })

    // When modal is used to edit unit
    this.timelineTransportStateService.$JobAssignmentChanged.subscribe((assignment: JobAssignment) => {
      const index = this.jobAssignments.findIndex(ja => ja.id === assignment.id);
      this.jobAssignments[index] = assignment;
    });

    this.timelineTransportStateService.$transportActiveBlockNumberChange.subscribe((no) => {
      this.activeBlockI = no;
    })

    this.timelineTransportStateService.$transportDragDataChanged.subscribe((data: any) => {
      this.dragData = data;
    });

    this.timelineTransportStateService.$transportJobCopyUnitDialogClosed.subscribe((job: Job) => {
      let newJob: Job = JSON.parse(JSON.stringify(job));
      newJob['driverJobStatus'] = {id: -1} as any;


      newJob.driverJobStatusId = -1;
      newJob.jobManagerSignOff = false;
      newJob.jobSignOffStatusId = -1;
      newJob.notes = '';
      newJob.weightNotes = '';
      newJob.transportSignOffNotes = '';
      newJob.subcontractorReg = '';
      newJob.timelineNotes = '';
      newJob.tippedSignature = '';
      newJob.tippedSignatureName = '';
      newJob.weight = 0;
      newJob.transportSignOffNotes = '';
      newJob.weight = -1;
      newJob.overridePrice = false;
      newJob.jobStatusId = 1; // pending
      newJob.jobStatus = {id: 1} as any;
      newJob.carriarSignature = '';
      newJob.carriarSignatureName = '';
      newJob.newPrice = 0;
      newJob.qty = 1;
      newJob.id = -1;

      this.jobService.createJob(newJob)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('could not copy job to unit');
        return e;
      }))
      .subscribe((createJob: Job) => {
        let assignment = this.jobAssignments.filter(ja => ja.id === job.jobAssignmentId)[0];

        newJob.id = createJob.id;

        assignment.jobs.push(newJob);

        this.timelineTransportStateService.$transportJobAssignmentsUpdated.next(this.jobAssignments);
      })
    })

    // When job dialog is closed
    this.timelineTransportStateService.$transportNewJobDialogClosed.subscribe((job: Job) => {
      
      const jobAssignment = this.jobAssignments.filter(ja => ja.id === job.jobAssignmentId)[0];

      const blockIsAllocated = jobAssignment.jobs.filter(j => j.blockNumber === job.blockNumber && j.jobStatusId !== 3)[0];

      if(blockIsAllocated) {
        alert('Cannot drop on a block which already has a job. please try a refresh.');
        return;
      }


      if(!jobAssignment) {
        alert('Cannot add job without assignment data');
        return;
      }


      //check selected empty block and dup

      let $tasks = [];
      let jobsOther = [];

      $tasks.push(this.jobService.createJob(job));

      this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.addJob, job);

      this.selectedEmptySlots.forEach((info) => {

        let jobOther: Job = JSON.parse(JSON.stringify(job));
        jobOther.jobAssignmentId = info.JobAssignmentId;
        jobOther.jobAssignment = {id: info.JobAssignmentId} as any;

        jobOther.blockNumber = info.blockId;

        jobsOther.push(jobOther);

        $tasks.push(this.jobService.createJob(jobOther));
        this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.addJob, jobOther);
      })


      forkJoin($tasks)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not create jobs please try again later.');
        return e;
      }))
      .subscribe((data: Job[]) => {
        job.id = data[0].id;
        jobAssignment.jobs.push(job);
        this.newJob = new Job();

        delete data[0];

        data.forEach((item, i) => {
          if(item) {
            jobsOther[i  -1].id = item.id;
            let jobAssignmentCurrent = this.jobAssignments.filter(ja => ja.id === item.jobAssignmentId)[0];
            jobAssignmentCurrent.jobs.push(jobsOther[i -1]);
          }
        })

       this.selectedEmptySlots = [];
       // this.loadJobAssignment();
       this.timelineTransportStateService.$transportJobAssignmentsUpdated.next(this.jobAssignments);

        //restore header
        document.getElementById("header").style.display = "flex";

      })
    })

    this.timelineTransportStateService.$transportSelectedJobsChanged.subscribe((jobs: Job[]) => {
      this.selectedJobs = jobs;
    })


    const lcDate = localStorage.getItem('MJL_TRANSPORT_TIMELINE_DATE');

    if(lcDate && lcDate !== '') {
      this.date = lcDate;
    }

    this.loadJobAssignment();
    this.loadVehicles();
    this.loadDrivers();

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load units')
      return e;
    }))
    .subscribe((data: Unit[]) => {
      this.units = data;
      this.timelineTransportStateService.$transportUnitsChanged.next(this.units);
    })

  }

  loadVehicles() {
    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load vehicles');
      return e;
    }))
    .subscribe((vehicles: any) => {
      this.vehicles = vehicles;
    })
  }


  loadDrivers() {
    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load vehicles');
      return e;
    }))
    .subscribe((drivers: any) => {
      this.drivers = drivers;
    })
  }



  loadPODs() {
    this.podService.getByPodsByDate(this.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load pods');
      return e;
    }))
    .subscribe((pods: any) => {
      this.pods = pods;
    })
  }

  openModal(modal:string) {
    this.modalService.open(modal);
  }

  openOrderModal(job: Job) {
    this.currentJob = JSON.parse(JSON.stringify(job));

    this.openModal("ArticjobTransportInformationModal");
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

      let amount = 0;

      this.jobAssignments.forEach((ja) => {
        amount += ja.slotNumber;

        if(ja.driverId === null || ja.driver === null) {
          ja.driverId = -1;
          ja.driver = new Driver();
        }
      });

      if(amount <= 0) {
        // apply older sort as a fallback
        this.applyFallbackSort();
      }

// Disable to rewrite as it's another db call in a lo0op
      // this.jobAssignments.forEach(round => {
      //   this.defectService.upcomingDateCheck(round.vehicleId)
      //   .pipe(take(1))
      //   .pipe(catchError((e) => {
      //     if(e.status === 403 || e.status === 401) {
      //       return e;
      //     }
      //     alert('Could not check inspection dates');
      //     return e;
      //   }))
      //   .subscribe((dates:any)=>{
      //     if(dates.length !== 0){
      //       round.upcomingInspection = moment(dates[0].bookedFor,'YYYY-MM-DD').format('DD/MM/YYYY');
      //     }
      //   })
      // })

      this.loadJobs();
      this.loadPODs();
      })
  }
  
  loadJobs() {
    //Hard code to tipper the now
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

      if(this.jobAssignments.length === 0 && this.autoPairAttempted === false) {
        this.autoPair();
        this.autoPairAttempted = true;
      }

      $( document ).ready(() => {
        $('.dragHandle').draggable();

        $('#mainTimelineBody').sortable({
          update: (event, ui) => {
            const elements = $('#mainTimelineBody').children();

            for(let i in elements) {
              const element: HTMLElement = elements[i];

              // not the selector rows
              if(+i > 0) {
                const jaId = +element.getAttribute('data-ja-id');
                // find job assignment in array
                const jobAssignment = this.jobAssignments.filter(ja => ja.id === jaId)[0];

                // Minus one to remove selectors at top of screen
                jobAssignment.slotNumber = +i - 1;


              }
            }



            // write all changes to db
            this.jobAssignmentService.bulkUpdateJobAssignment(JSON.parse(JSON.stringify(this.jobAssignments)))
            .pipe(take(1))
            .pipe(catchError((e) => {
              if(e.status === 403 || e.status === 401) {
                return e;
              }
              alert('error updating position of unit');
              return e;
            }))
            .subscribe(() => {
              // this.saveUnitOrder();
            })

          }
        });
    });
      this.timelineTransportStateService.$transportJobAssignmentsUpdated.next(this.jobAssignments);


    });


  }

  saveUnitOrder() {
    let sortOrders: TransportTimeLineSortOrder[] = [];

    this.jobAssignments.forEach((ja) => {
      let sortOrder = new TransportTimeLineSortOrder();
      sortOrder.driverId = ja.driverId;
      sortOrder.unitName = ja.name;
      sortOrder.vehicleId = ja.vehicleId;
      sortOrder.subcontractorId = ja.subcontractorId;
      sortOrder.sortOrder = ja.slotNumber;

      sortOrders.push(sortOrder);
    })

    this.transportTimelineSortOrderService.deleteAll()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not delete existing sort orders');
      return e;
    }))
    .subscribe(() => {
      this.transportTimelineSortOrderService.bulkCreate(sortOrders)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('could not create sort orders');
        return e;
      }))
      .subscribe(() => {

      })
    })

  }

  autoPair() {
    const vehicleMatch = environment.timelineOptions.filter(f=>f.value === this.orderTypeId)[0];

    this.jobAssignmentService.autoPair(this.date, +vehicleMatch.match, this.orderTypeId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      // alert('Could not auto pair units');
      return e;
    }))
    .subscribe((data) => {
      // maybe put a message here.
      this.loadJobAssignment();
    })
  }

  applyFallbackSort() {
    this.jobAssignments.sort((a, b) => {
      const valueToCheckA = a.vehicle ? a.vehicle.registration : '';
      const valueToCheckB = b.vehicle ? b.vehicle.registration : '';
      return  valueToCheckA < valueToCheckB ? 1 : -1;
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

    this.timelineTransportHistoryService.addEvent(TimelineHistoryEventType.deleteUnit, jobAssignment);

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

      // log it


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

    alert('sss');
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
  newjob.time = "07:30";

  // set suggested time
  if(order.suggestedTime && order.suggestedTime !== '') {
    newjob.time = order.suggestedTime;
  }

  this.newJob = newjob;

  assignment.jobs = assignment.jobs.filter(j => j.id !== job.id);

  this.modalService.open('ArtictransportJobCreationModal');
  }


  isCheckboxActive(job: Job) {
    // if(job.jobStatusId > 3) {
    //   return false;
    // }

    // return true;

    // Always show checkbox
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
      newJob.qty = 1;
      newJob.weightNotes = '';
      newJob.jobStatusId = 1;
      newJob.jobStatus = {id: 1} as any;
      newJob.notes = '';
      newJob.transportSignOffNotes = '';
      newJob.jobSignOffStatusId = -1;
      newJob.id = -1;

      this.jobService.createJob(newJob)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not update job please try again later');
        return e;
      }))
      .subscribe(() => {
        //add to new one
        newJobAssignment.jobs.push(newJob);
        this.timelineTransportStateService.$transportJobAssignmentsUpdated.next(this.jobAssignments);

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
    job.jobAssignment = jobAssignment;
    job.jobStatusId = 1;
    job.jobStatus.id = 1;
    job.orderId = order.id;
    job.order = order;
    job.time = "07:30";

      // set suggested time
    if(order.suggestedTime && order.suggestedTime !== '') {
      job.time = order.suggestedTime;
    }

    order.allocated = 1;

    this.newJob = job;

    this.orderProvisionService.updateSingleToAllocatedByOrderIdAndDate(order.id, this.date)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update provision');
      return e;
    }))
    .pipe(take(1))
    .subscribe(()  => {
      this.modalService.open('ArtictransportJobCreationModal');
    });
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

    if(!job.jobManagerSignOff && !(job.jobSignOffStatusId === 4 || job.jobStatusId === 4) && job.deliveryDriverId !== -1 && job.jobStatusId === 2) {
      colorCode = '#16a085';
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

  onSelectedAssignmentCheckbox($event, assignment: JobAssignment) {
    if(!$event.target.checked) {
      this.selectedAssignments = this.selectedAssignments.filter(j => j.id !== assignment.id);
    } else {
      this.selectedAssignments.push(assignment);
    }

    this.timelineTransportStateService.$transportSelectedJobAssignmentsChanged.next(this.selectedAssignments);
  }


  onSelectAllCheckboxClicked($event,blocki) {
    //this.selectedJobs = [];
    if(!$event.target.checked) {
      // remove all from selected jobs
      this.selectedJobs = this.selectedJobs.filter(sj => sj.blockNumber !== blocki);
      this.activeBlockI = -1;
    } else {
      //add all
      let jobs = [];

      this.jobAssignments.forEach((jobAssignment) => {
        jobs = jobs.concat(jobAssignment.jobs.filter(j => j.blockNumber === blocki && j.jobStatusId !== 3 && j.jobStatusId !== 4 && j.jobStatusId !== 5));
      })
      this.selectedJobs = this.selectedJobs.concat(jobs);
      this.activeBlockI = blocki;
    }

    this.timelineTransportStateService.$transportSelectedJobsChanged.next(this.selectedJobs);

  }

  isSelectAllSelected(blocki: number) {
    return this.activeBlockI === blocki;
  }

  isBoxChecked(job: Job) {
    return this.selectedJobs.filter(sj => sj.id === job.id).length > 0;
  }

  isAssignmentBoxChecked(assignment: JobAssignment) {
    return this.selectedAssignments.filter(sj => sj.id === assignment.id).length > 0;
  }

  onAddAssignmentNoteClicked() {
    if(this.selectedAssignments.length === 0) {
      alert('You must select at least one driver/vehicle to add note');
      return;
    }

    this.modalService.open('ArtictransportNoteAssignmentCreationModal');
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

  getColourForJobStatus(statusId: number) {
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

  getUnitForJob(job: any) {


    let orderLine = job.order?.orderLines.filter(ol => ol.isPrimaryCharge)[0];

    if(!orderLine) {
      orderLine = job.order.orderLines[0];
    }

    if(!orderLine) {
      return 'N/A';
    }


    const unit = this.units.filter(u => u.id === orderLine.quoteLine?.product.unitId)[0];

    if(unit) {
      return unit.name;
    } else {
      // must be quick item
      const unitpl = this.units.filter(u => u.id === orderLine.unitId)[0];

      if(!unitpl) {
        return 'N/A';
      }
      return unitpl.name;
    }

  }

  getPODQtyForJobId(job: Job) {
    let qty = 0;

    const pods = this.pods.filter(p => p.jobId === job.id);

    pods.forEach((pod) => {
      qty += pod.qty;
    })

    // Fallback to job qty if
    const amount =  qty > 0 && !job.jobManagerSignOff ? qty : job.qty;

    return amount.toFixed(2);
  }

  getDriverStatus(id: number=-1) {
    const status = ["N/A", "Pending","On Way", "On Site", "To Tip", "Driver Completed"];

    return status[id] ? status[id] : 'N/A';
  }

  isEmptySlockCheckChecked(jobAllocationId, blockId) {
    return this.selectedEmptySlots.filter(se => se.jobAssignmentId === jobAllocationId && se.blockId === blockId).length > 0;
  }
  onEmptySlotChecked(jobAllocationId, blockId) {
    const hasItem = this.selectedEmptySlots.filter(se => se.jobAssignmentId === jobAllocationId && se.blockId === blockId).length > 0;
    if(!hasItem) {
      this.selectedEmptySlots.push({
        JobAssignmentId: jobAllocationId,
        blockId: blockId
      })
    }
  }

  copyJobs(jobAssignment: JobAssignment) {
    this.timelineTransportStateService.$transportCopyDataUpdated.next([jobAssignment, jobAssignment.jobs]);
    this.modalService.open('ArtictransportCopyJobsModal');
  }

  getUpdatedBy(job: Job) {
    if(job.updatedBy !== -1) {
      return job['updatedUser'].firstName + ' ' + job['updatedUser'].lastName;
    }

    return null;
  }

  getCreatedBy(job: Job) {
    if(job.createdBy !== -1) {
      return job['createdUser'].firstName + ' ' + job['createdUser'].lastName;
    }

    return null;
  }

  getHoverText(record) {
    let orderLine = record.order.orderLines[0];

    let productName = '';
    if(orderLine) {
      productName = orderLine.name;
    }
    return 'Job ID: ' + record.id + ' Tickets: ' + record.transportSignOffNotes + ' Order REF: ' + record.order.poNumber + ' Tip Site: ' + record.order.tipSite.name + ' Product Details: ' + productName;
  }

  getVehicleRegById(vehicleId:number=-1): string {
    let vehicle = this.vehicles.filter(v => v.id === vehicleId)[0];

    let reg = '';

    if(vehicle) {
      reg = vehicle.registration;
    }

    return reg;
  }

  getDriverNameById(driverId: number=-1) {
    let driver = this.drivers.filter(d => d.id === driverId)[0];
    let name = '';

    if(driver) {
      name = driver.firstName + ' ' + driver.lastName;
    }

    return name;
  }
}

