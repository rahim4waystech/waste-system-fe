import { Component, OnInit, ViewChildren } from '@angular/core';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import * as moment from 'moment';
import { ArticRoute } from 'src/app/timeline-artic/models/articRoute.model';
import { TimelineArticStateService } from '../../services/timeline-artic-state.service';
import { OrderService } from 'src/app/order/services/order.service';
import { take, catchError } from 'rxjs/operators';
import { Order } from 'src/app/order/models/order.model';
import { SkipRound } from 'src/app/timeline-skip/models/skip-round.model';
import { SkipRoundService } from 'src/app/timeline-skip/services/skip-round.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { DriverAbsenceService } from 'src/app/driver/services/driver-absence.service';
import { DriverAbsence } from 'src/app/driver/models/driver-absence.model';
import { VehicleVOR } from 'src/app/vehicle/models/vehicle-vor.model';
import { VehicleVorService } from 'src/app/vehicle/services/vehicle-vor.service';
import { Router } from '@angular/router';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserSettingsService } from 'src/app/settings/services/user-settings.service';
import { Personalisation } from 'src/app/settings/models/personalisation.model';
import { UserService } from 'src/app/user/services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';
import { DefectService } from 'src/app/workshop/services/defect.service';
declare var $;

@Component({
  selector: 'app-timeline-artic',
  templateUrl: './timeline-artic.component.html',
  styleUrls: ['./timeline-artic.component.scss']
})
export class TimelineArticComponent implements OnInit {
  // pagination stuff

  // Small values for testing purposes
  pageLimit = 10;
  orderLimit = 10;
  // pageLimit = 5;
  // orderLimit = 10;

  driverPage = 1;
  vehiclePage = 1;
  trailerPage = 1;
  subbiePage = 1;
  orderPage = 1;

  driverMax = 0;
  vehicleMax = 0;
  trailerMax = 0;
  subbieMax = 0;
  orderMax = 0;

  driverTotal = 0;
  vehicleTotal = 0;
  trailerTotal = 0;
  subbieTotal = 0;
  orderTotal = 0;

  // other stuff
  showOrders = false;
  drivers: any = {};
  subcontractors: any = [];
  absentDrivers: any = {};
  vehicles: any = {};
  vorVehicles: any = {};
  vorTrailers: any = {};
  trailers: any = {};
  articId: number = 6;
  trailerId: number = 7;
  draggingId: number = -1;
  dragData: any = {};
  jobs: Job[] = [];
  orders: Order[] = [];
  subTrailer: any = {id:0};

  toggleDrivers: Boolean = false;
  toggleArtics: Boolean = false;
  toggleTrailers: Boolean = false;
  toggleSubbies: Boolean = false;
  toggleUnavailables: Boolean = false;

  date: string = moment().format('YYYY-MM-DD');
  isDatePickerVisible:boolean = false;
  search: string = '';
  searchString: string = '';
  searchTimeline: string = '';
  page: number = 1;
  sortBy: string = 'time';
  vehicleTypeId: number = 6;
  jobAssignment: JobAssignment[] = [];
  assignments: JobAssignment[] = [];
  currentOrder: Order = new Order();
  tempVehicles:any = [];
  tempVorVehicles:any = [];

  routes: any = [];
  absenceAndVors: any = {absence: [], vor: []}
  currentRoute:ArticRoute = new ArticRoute();
  timelineSettings:Personalisation = new Personalisation();
  user: User = new User();

  updatingJob: any = {};

  constructor(
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private articDragDataChanged: TimelineArticStateService,
    private orderService:OrderService,
    private jobAssignmentService:JobAssignmentService,
    private jobService: JobService,
    private driverAbsenceService: DriverAbsenceService,
    private vehicleVORService: VehicleVorService,
    private subcontractorService:SubcontractorService,
    private defectService:DefectService,
    private modalService:ModalService,
    private authService:AuthService,
    private userSettingsService: UserSettingsService
    // public articRoute: ArticRoute
  ) { }

  ngOnInit(): void {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    this.timelineSettings.timelineOrientationArtic = true;

    this.user = this.authService.getUser();

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


    this.articDragDataChanged.$articRoundAdded.subscribe(() => {
      this.loadRoutes(null);
    });

    this.articDragDataChanged.$articOrderAdded.subscribe(() => {
      this.loadRoutes(null);
    });

    this.loadContent(null);

    this.articDragDataChanged.$articDragDataChanged.subscribe(data => {
      this.dragData = data;
    })
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

  runSearch(){
    // this.loadcontent();
  }

  loadContent(openId:number){
    this.loadDrivers(this.driverPage,this.pageLimit);
    this.loadSubcontractors(this.subbiePage,this.pageLimit);
    this.loadVehicles(this.vehiclePage,this.pageLimit);
    this.loadTrailers(this.trailerPage,this.pageLimit);

    this.loadRoutes(openId);
    this.loadOrders(this.orderPage,this.orderLimit);
    this.getAllocations();
  }

  switchPage(type:string,area:string){
    if(area === 'driver'){
      switch(type){
        case 'first':
          this.driverPage = 1;
          break;
        case 'next':
          this.driverPage = this.driverPage + 1;
          break;
        case 'previous':
          this.driverPage = this.driverPage - 1;
          break;
        case 'last':
          this.driverPage = this.driverMax;
          break;
      }
      if(this.driverPage === 0){this.driverPage = 1;}
      if(this.driverPage > this.driverMax){this.driverPage = this.driverMax;}

      this.loadDrivers(this.driverPage,this.pageLimit);
    } else if(area === 'vehicle'){
      switch(type){
        case 'first':
          this.vehiclePage = 1;
          break;
        case 'next':
          this.vehiclePage = this.vehiclePage + 1;
          break;
        case 'previous':
          this.vehiclePage = this.vehiclePage - 1;
          break;
        case 'last':
          this.vehiclePage = this.vehicleMax;
          break;
      }
      if(this.vehiclePage === 0){this.vehiclePage = 1;}
      if(this.vehiclePage > this.vehicleMax){this.vehiclePage = this.vehicleMax;}

      this.loadVehicles(this.vehiclePage,this.pageLimit);
    } else if(area === 'trailer'){
      switch(type){
        case 'first':
          this.trailerPage = 1;
          break;
        case 'next':
          this.trailerPage = this.trailerPage + 1;
          break;
        case 'previous':
          this.trailerPage = this.trailerPage - 1;
          break;
        case 'last':
          this.trailerPage = this.trailerMax;
          break;
      }
      if(this.trailerPage === 0){this.trailerPage = 1;}
      if(this.trailerPage > this.trailerMax){this.trailerPage = this.trailerMax;}

      this.loadTrailers(this.trailerPage,this.pageLimit);
    } else if(area === 'subbie'){
      switch(type){
        case 'first':
          this.subbiePage = 1;
          break;
        case 'next':
          this.subbiePage = this.subbiePage + 1;
          break;
        case 'previous':
          this.subbiePage = this.subbiePage - 1;
          break;
        case 'last':
          this.subbiePage = this.subbieMax;
          break;
      }
      if(this.subbiePage === 0){this.subbiePage = 1;}
      if(this.subbiePage > this.subbieMax){this.subbiePage = this.subbieMax;}

      this.loadSubcontractors(this.subbiePage,this.pageLimit);
    } else if(area === 'order'){
      switch(type){
        case 'first':
          this.orderPage = 1;
          break;
        case 'next':
          this.orderPage = this.orderPage + 1;
          break;
        case 'previous':
          this.orderPage = this.orderPage - 1;
          break;
        case 'last':
          this.orderPage = this.orderMax;
          break;
      }
      if(this.orderPage === 0){this.orderPage = 1;}
      if(this.orderPage > this.orderMax){this.orderPage = this.orderMax;}

      this.loadOrders(this.orderPage,this.orderLimit);
    }


  }

  loadDrivers(page:number,limit:number){
    this.drivers = [];
    this.absentDrivers = [];

    let activeDrivers = [];
    this.driverService.getPaginatedDrivers(limit,page)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get Drivers');
      return e;
    }))
    .pipe(take(1))
    .subscribe(drivers => {
      const tempDrivers = drivers['data'];
      this.driverMax = drivers['pageCount'];
      this.driverTotal = drivers['total'];

      activeDrivers = tempDrivers.filter(f=>f.active);

      this.driverAbsenceService.getAbsenceByDate(this.date)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert("driver absence could not be loaded");
        return e;
      }))
      .subscribe((data: DriverAbsence[]) => {
        this.absenceAndVors.absence = data;

        activeDrivers.forEach(driver => {
          let absentNo = 0;

          for(let i=0;i<this.absenceAndVors.absence.length;i++){
            if(this.absenceAndVors.absence[i].driverId === driver.id){
              absentNo++;
              driver.absence = this.absenceAndVors.absence[i];
            }
          }

          if(absentNo === 0){
            this.drivers.push(driver);
          } else {
            this.absentDrivers.push(driver);
          }
        })

        const allocatedDrivers = this.drivers.filter(f=> this.checkAllocationStatus(f.id,"driver"));
        const unallocatedDrivers = this.drivers.filter(f=> !this.checkAllocationStatus(f.id,"driver"));

        this.drivers = [];

        unallocatedDrivers.forEach(unallocated=>{
          this.drivers.push(unallocated);
        })

        allocatedDrivers.forEach(allocated=>{
          this.drivers.push(allocated);
        })

      })
    })
  }

  loadVehicles(page:number,limit:number){
    this.vehicles = [];
    this.vorVehicles = [];
    let tempVehicles = [];
    this.vehicleService.getAllPaginatedVehicles(limit,page,this.articId)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get Vehicles');
      return e;
    }))
    .pipe(take(1))
    .subscribe(vehicles => {
      tempVehicles = vehicles['data'].filter(f => f.vehicleTypeId === this.articId);
      this.vehicleMax = vehicles['pageCount'];
      this.vehicleTotal = vehicles['total'];

      this.vehicleVORService.getVehicleVORsByDate(this.date)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert("vehicle VOR could not be loaded");
        return e;
      }))
      .subscribe((data: VehicleVOR[]) => {
        this.absenceAndVors.vor = data;

        tempVehicles.forEach(vehicle => {
          let vorNo = 0;
          for(let i=0;i<this.absenceAndVors.vor.length;i++){
            if(this.absenceAndVors.vor[i].vehicleId === vehicle.id){
              vorNo++;
              vehicle.vor = this.absenceAndVors.vor[i];
            }
          }

          if(vorNo === 0){
            this.vehicles.push(vehicle);
          } else {
            this.vorVehicles.push(vehicle);
          }


        })

        const allocatedVehicles = this.vehicles.filter(f=> this.checkAllocationStatus(f.id,"vehicle"));
        const unallocatedVehicles = this.vehicles.filter(f=> !this.checkAllocationStatus(f.id,"vehicle"));
        this.vehicles = [];
        unallocatedVehicles.forEach(unallocated=>{
          this.vehicles.push(unallocated);
        })
        allocatedVehicles.forEach(allocated=>{
          this.vehicles.push(allocated);
        })

      })
    })
  }

  loadTrailers(page:number,limit:number){
    this.trailers = [];
    this.vorTrailers = [];
    let tempTrailers = [];
    this.vehicleService.getAllPaginatedTrailers(limit,page,this.trailerId)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get trailers');
      return e;
    }))
    .pipe(take(1))
    .subscribe(vehicles => {
      tempTrailers = vehicles['data'].filter(f => f.vehicleTypeId === this.trailerId);
      this.trailerMax = vehicles['pageCount'];
      this.trailerTotal = vehicles['total'];

      this.vehicleVORService.getVehicleVORsByDate(this.date)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert("vehicle VOR could not be loaded");
        return e;
      }))
      .subscribe((data: VehicleVOR[]) => {
        this.absenceAndVors.vor = data;

        tempTrailers.forEach(vehicle => {
          let vorNo = 0;
          for(let i=0;i<this.absenceAndVors.vor.length;i++){
            if(this.absenceAndVors.vor[i].vehicleId === vehicle.id){
              vorNo++;
              vehicle.vor = this.absenceAndVors.vor[i];
            }
          }

          if(vorNo === 0){
            this.trailers.push(vehicle);
          } else {
            this.vorTrailers.push(vehicle);
          }
        })
        const allocatedVehicles = this.trailers.filter(f=> this.checkAllocationStatus(f.id,"trailer"));
        const unallocatedVehicles = this.trailers.filter(f=> !this.checkAllocationStatus(f.id,"trailer"));
        this.trailers = [];
        unallocatedVehicles.forEach(unallocated=>{
          this.trailers.push(unallocated);
        })
        allocatedVehicles.forEach(allocated=>{
          this.trailers.push(allocated);
        })
      })
    })
  }

  loadRoutes(openId:number){
    this.routes = [];

    const articOrderId = 4;

    this.jobAssignmentService.getAllJobAssignmentRoutesByDateByOrderType(this.date, articOrderId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load job assignment for date');
      return e;
    }))
    .subscribe((assignments: JobAssignment[]) => {
      this.routes = assignments;

      this.jobs = [];
      this.jobService.getArticJobsByDate(this.date)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert("Accepted Jobs could not be loaded");
        return e;
      }))
      .subscribe((data: Job[]) => {
        this.jobs = data;

        this.routes.forEach(route => {
          if(route.vehicleId > 0){
            this.defectService.upcomingDateCheck(route.vehicleId)
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
                route.upcomingInspection = moment(dates[0].bookedFor,'YYYY-MM-DD').format('DD/MM/YYYY');
              }
            })
          }


          route.jobs = [];
          route.jobs = this.jobs.filter(f => f.jobAssignmentId === route.id);

          if(route.subcontractorId !== -1){
            route.subcontractor = this.subcontractors.filter(f=>f.id === route.subcontractorId)[0];
          }

          if(openId !== null){
            if(route.jobAssignmentId === openId){
              route.expand = false;
            } else {
              route.expand = true;
            }
          } else {
            route.expand = false;
          }

          route.jobs.forEach(job => {
            if(job.jobStatusId === -1){
              job.jobStatusId = 1;
            }

            if(job.time === null || job.time === undefined || job.time === ''){
              job.time = 'n/a'
            }
            // job.time = moment(job.order.time,'HH:mm:ss').format('HH:mm');
            job.endTime = moment(job.time,'HH:mm:ss').add(job.duration,'h').format('HH:mm');

            // if(job.time < route.driverStartTime || route.driverStartTime === ''){
            //   route.driverStartTime = job.time;
            // }
          })
        })
        this.countAllocations();
      })
    });
    // this.countAllocations();
  }

  loadOrders(page:number,limit:number) {
    this.orders = [];
    this.orderService.getPaginatedArticOrdersForTimelineByDate(this.date, page,limit, this.sortBy, this.vehicleTypeId, this.search)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Accepted Jobs could not be loaded");
      return e;
    }))
    .subscribe((data: Order[]) => {
      this.orders = data['data'];
      this.orderMax = data['pageCount'];
      this.orderTotal = data['total'];

      this.orders.forEach(order => {
        this.orderService.getOrderLinesByOrderId(order.id)
        .pipe(catchError((e)=>{
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not get Quote Details');
          return e;
        }))
        .pipe(take(1))
        .subscribe(quotes => {
          order.quotes = quotes[0];
        })
      })
      this.countAllocations();
    })
  }

  loadSubcontractors(page:number,limit:number){
    this.subcontractors = [];

    this.subcontractorService.getPaginatedSubcontractors(page,limit)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get Subcontractorss');
      return e;
    }))
    .pipe(take(1))
    .subscribe(subbies =>{
      this.subcontractors = subbies['data'];
      this.subbieMax = subbies['pageCount'];
      this.subbieTotal = subbies['total'];
    })
  }

  countAllocations(){
    this.orders.forEach(order => {
      order.orderCount = 0;

      this.routes.forEach(route => {
        if(route.jobs !== undefined){
          route.jobs.forEach(job =>{
            if(job.orderId === order.id){
              order.orderCount += job.qty;
            }
          })
        }
      })
    })
  }

  dragStart(event, inputObject,type) {
    // this.draggingId = driver.id;
    this.articDragDataChanged.$articDragDataChanged.next({type: type, data: inputObject});
  }

  dragEnd(event) {
     this.draggingId = -1;
  }

  onDrop($event) {
    let i = +$event.srcElement.dataset.id;
    if(this.routes[i].jobs.length !== 0){
      let checkSent = this.routes[i].jobs.filter(f=>f.jobStatusId === 2);
      if(checkSent.length > 0){
        alert('You can\'t modify a Route with Jobs sent to Driver')
      } else {
        if(this.routes[i].subcontractorId !== -1 && this.dragData.type !== 'order') {
          if(confirm('Replace Subcontractor?')){
            this.routes[i].subcontractorId = -1;
            this.routes[i].driverId = -1;
            this.routes[i].trailerId = -1;
            this.routes[i].vehicleId = -1;
          }
        }

        switch(this.dragData.type){
          case 'driver':
            if(this.routes[i].driverId !== -1 && this.routes[i].subcontractorId === -1){
              if(confirm('Replace the current Driver?')){
                this.routes[i].driverId = this.dragData.data.id;
                this.routes[i].driver = this.dragData.data;

                // this.routes[i].driver = this.dragData.data.firstName[0]+' '+this.dragData.data.lastName;
              }
            } else {
              this.routes[i].driverId = this.dragData.data.id;
              this.routes[i].driver = this.dragData.data;
              // this.routes[i].driver = this.dragData.data.firstName[0]+' '+this.dragData.data.lastName;
            }

            this.updateRoute(i);
            break;
          case 'trailer':
            if(this.routes[i].trailerId !== -1 && this.routes[i].subcontractorId === -1){
              if(confirm('Replace the current Trailer?')){
                if(this.dragData.data.id === '0' || this.dragData.data.id === 0){
                  this.routes[i].trailerId = 0;
                  this.routes[i].trailer = {id: 0};
                } else {
                  this.routes[i].trailerId = this.dragData.data.id;
                  this.routes[i].trailer = this.dragData.data;
                  // this.routes[i].trailer = this.dragData.data.vinNumber;
                }
              }
            } else {
              if(this.dragData.data.id === '0' || this.dragData.data.id === 0){
                this.routes[i].trailerId = 0;
                this.routes[i].trailer = {id: 0};
              } else {
                this.routes[i].trailerId = this.dragData.data.id;
                this.routes[i].trailer = this.dragData.data;
                // this.routes[i].trailer = this.dragData.data.vinNumber;
              }
            }
            this.updateRoute(i);
            break;
          case 'vehicle':
            if(this.routes[i].vehicleId !== -1 && this.routes[i].subcontractorId === -1){
              if(confirm('Replace the current Vehicle?')){
                this.routes[i].vehicleId = this.dragData.data.id;
                this.routes[i].vehicle = this.dragData.data;
                // this.routes[i].vehicle = this.dragData.data.registration;
              }
            } else {
              this.routes[i].vehicleId = this.dragData.data.id;
              this.routes[i].vehicle = this.dragData.data;
              // this.routes[i].vehicle = this.dragData.data.registration;
            }


            this.updateRoute(i);
            break;
          case 'order':
            let newJob = new Job();

            newJob.orderId = this.dragData.data.id;
            newJob.order = this.dragData.data;
            newJob.jobAssignment = this.routes[i];
            newJob.jobAssignmentId = this.routes[i].id;
            newJob.jobStatusId = 1;
            newJob.blockNumber = 0;
            newJob.qty = 1;
            newJob.date = this.date;
            newJob.time = this.dragData.data.time;
            newJob.containerOutId = -1
            newJob.containerInId = -1
            newJob.jobSignOffStatusId = -1
            newJob.tipAndReturn = false;
            newJob.weight = -1

            this.updatingJob = newJob;
            this.openModal("jobTimeSet");

            // this.jobService.createJob(newJob).subscribe(()=>{
            //   this.loadRoutes(null);
            // })
            break;
          case 'subcontractor':
            if(this.routes[i].subcontractorId !== -1){
              if(confirm('Replace the current Vehicle?')){
                this.routes[i].subcontractorId = this.dragData.data.id;
                this.routes[i].subcontractor = this.dragData.data;
              }
            } else {
              this.routes[i].subcontractorId = this.dragData.data.id;
              this.routes[i].subcontractor = this.dragData.data;
            }
            this.updateRoute(i);

            break;
        }
      }
    } else {
      switch(this.dragData.type){
        case 'driver':
          if(this.routes[i].driverId !== -1){
            if(confirm('Replace the current Driver?')){
              this.routes[i].driverId = this.dragData.data.id;
              this.routes[i].driver = this.dragData.data;

              // this.routes[i].driver = this.dragData.data.firstName[0]+' '+this.dragData.data.lastName;
            }
          } else {
            this.routes[i].driverId = this.dragData.data.id;
            this.routes[i].driver = this.dragData.data;
            // this.routes[i].driver = this.dragData.data.firstName[0]+' '+this.dragData.data.lastName;
          }
          this.updateRoute(i);
          break;
        case 'trailer':
        if(this.routes[i].trailerId !== -1){
          if(confirm('Replace the current Trailer?')){
            if(this.dragData.data.id === '0' || this.dragData.data.id === 0 || this.dragData.data.id === null){
              this.routes[i].trailerId = 0;
              this.routes[i].trailer = {id: 0};
            } else {
              this.routes[i].trailerId = this.dragData.data.id;
              this.routes[i].trailer = this.dragData.data;
              // this.routes[i].trailer = this.dragData.data.vinNumber;
            }
          }
        } else {
          if(this.dragData.data.id === '0' || this.dragData.data.id === 0 || this.dragData.data.id === null){
            this.routes[i].trailerId = 0;
            this.routes[i].trailer = {id: 0};
          } else {
            this.routes[i].trailerId = this.dragData.data.id;
            this.routes[i].trailer = this.dragData.data;
            // this.routes[i].trailer = this.dragData.data.vinNumber;
          }
        }
        this.updateRoute(i);
          break;
        case 'vehicle':
          if(this.routes[i].vehicleId !== -1){
            if(confirm('Replace the current Vehicle?')){
              this.routes[i].vehicleId = this.dragData.data.id;
              this.routes[i].vehicle = this.dragData.data;
              this.routes[i].depotId = this.dragData.data.depotId;
              // this.routes[i].vehicle = this.dragData.data.registration;
            }
          } else {
            this.routes[i].vehicleId = this.dragData.data.id;
            this.routes[i].vehicle = this.dragData.data;
            this.routes[i].depotId = this.dragData.data.depotId;
            // this.routes[i].vehicle = this.dragData.data.registration;
          }


          this.updateRoute(i);
          break;
        case 'order':
          let newJob = new Job();

          newJob.orderId = this.dragData.data.id;
          newJob.order = this.dragData.data;
          newJob.jobAssignment = this.routes[i];
          newJob.jobAssignmentId = this.routes[i].id;
          newJob.jobStatusId = 1;
          newJob.blockNumber = 0;
          newJob.qty = 1;
          newJob.date = this.date;
          newJob.time = this.dragData.data.time;
          newJob.containerOutId = -1
          newJob.containerInId = -1
          newJob.jobSignOffStatusId = -1
          newJob.tipAndReturn = false;
          newJob.weight = -1

          this.updatingJob = newJob;
          this.openModal("jobTimeSet");

          // this.jobService.createJob(newJob).subscribe(()=>{
          //   this.loadRoutes(null);
          // })
          break;
        case 'subcontractor':
          if(this.routes[i].subcontractorId !== -1){
            if(confirm('Replace the current Vehicle?')){
              this.routes[i].subcontractorId = this.dragData.data.id;
              this.routes[i].subcontractor = this.dragData.data;
            }
          } else {
            this.routes[i].subcontractorId = this.dragData.data.id;
            this.routes[i].subcontractor = this.dragData.data;
          }
          this.updateRoute(i);
          break;
      }
    }
  }

  getAllocations(){
    this.jobAssignmentService.getAllJobAssignmentByDate(this.date)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not check assignments');
      return e;
    }))
    .pipe(take(1))
    .subscribe((assignment:JobAssignment[]) => {
      this.assignments = assignment;
    })
  }

  checkAllocationStatus(id:number, entity:string){
    switch(entity){
      case 'vehicle':
        if(this.assignments.filter(f=> f.vehicleId === id).length > 0){
          return true;
        } else {
          return false;
        }
        break;
      case 'driver':
        if(this.assignments.filter(f=> f.driverId === id).length > 0){
          return true;
        } else {
          return false;
        }
        break;
      case 'trailer':
        if(this.assignments.filter(f=> f.trailerId === id).length > 0){
          return true;
        } else {
          return false;
        }
        break;
    }
  }

  updateRoute(i){
    if(this.routes[i].trailerId === 0){
      delete this.routes[i].trailer;
      this.routes[i].trailer = {id: 0};
    }

    if(this.routes[i].subcontractor === null || this.routes[i].subcontractor === undefined){
      this.routes[i].subcontractor = {id:-1};
    }

    this.jobAssignmentService.updateJobAssignment(this.routes[i])
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save Route');
      // refresh this assignment
      this.jobAssignmentService.getArticJobAssignmentById(this.routes[i].id)
      .pipe(catchError((e)=>{
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not recover last configuration of Route');
        this.loadContent(null)
        return e;
      }))
      .pipe(take(1))
      .subscribe((route:any) => {
        // if(route.vehicleId !== -1){route.vehicle = this.vehicles.filter(f=>f.id===route.vehicleId)[0];}
        // if(route.trailerId !== -1){route.trailer = this.trailers.filter(f=>f.id===route.trailerId)[0];}
        // if(route.driverId !== -1){route.driver = this.drivers.filter(f=>f.id===route.driverId)[0];}

        if(route.vehicleId > 0){
          this.defectService.upcomingDateCheck(route.vehicleId)
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
              route.upcomingInspection = moment(dates[0].bookedFor,'YYYY-MM-DD').format('DD/MM/YYYY');
            }
          })
        }


        this.routes[i] = route;


      })
      return e;
    }))
    .pipe(take(1))
    .subscribe(() => {
      this.getAllocations();
      this.loadDrivers(this.driverPage,this.pageLimit);
      this.loadVehicles(this.driverPage,this.pageLimit);
      this.loadTrailers(this.driverPage,this.pageLimit);

      // this.loadRoutes(null);
    })
  }

  dragEnter(event, item, unit) {
    event.currentTarget.classList.add('dragover');
      if(unit.driverId !== ''){
      } else {
      }
      // this.currentHoveringRoundId = round.id;
  }

  dragLeave (event) {
    event.currentTarget.classList.remove('dragover');
    // this.currentHoveringRoundId = -1;
  }

  changeTime(){
   // alert('Modal with time input')
  }

  formatTime(time){
    return moment(time,'HH:mm:ss').format('HHmm')
  }

  ukDate(date){
    return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  onDateSelected($event) {

    // make sure inital setting of value doesn't hide the datepicker
    if(moment(this.date).unix() !== moment($event).unix()) {
      this.isDatePickerVisible = false;
    }

    this.date = moment($event).format('YYYY-MM-DD');

    this.loadContent(null);
  }

  getFormattedDate(): string {
    return moment(this.date).format('dddd MMMM Do YYYY');
  }

  nextDay() {
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.loadContent(null);
  }

  prevDay() {
    this.date = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
    this.loadContent(null);
  }

  updateJob(action, updatedJob: Job){
    switch(action){
      case 'approve':
        updatedJob.jobStatusId = 2;

        this.jobService.updateJob(updatedJob)
        .pipe(catchError((e)=>{
          alert('Could not save Job Details');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.loadContent(null);
        })
        break;
      case 'unapprove':
        updatedJob.jobStatusId = 1;

        this.jobService.updateJob(updatedJob)
        .pipe(catchError((e)=>{alert('Could not save Job Details');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.loadContent(null);
        })
        break;
      case 'remove':
        updatedJob.jobStatusId = 3;

        this.jobService.updateJob(updatedJob)
        .pipe(catchError((e)=>{alert('Could not save Job Details');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.loadContent(null);
        })
        break;
      case 'qtyChange':
        if(updatedJob.qty <= 0){
          if(confirm('Qty of 0 will delete Job from timeline')){
            updatedJob.jobStatusId = 3;
          }
        }

        this.jobService.updateJob(updatedJob)
        .pipe(catchError((e)=>{alert('Could not update Job');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.loadContent(updatedJob.jobAssignmentId);
        })
        break;
      case 'qtyUp':
        updatedJob.qty = updatedJob.qty + 1;

        this.jobService.updateJob(updatedJob)
        .pipe(catchError((e)=>{alert('Could not update Job');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.loadContent(null);
        })
        break;
      case 'qtyDown':
        if(updatedJob.qty === 1){
          if(confirm('Qty of 0 will delete Job from timeline')){
            updatedJob.jobStatusId = 3;
          }
        } else {
          updatedJob.qty = updatedJob.qty - 1;
        }

        this.jobService.updateJob(updatedJob)
        .pipe(catchError((e)=>{alert('Could not update Job');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.loadContent(null);
        })
        break;
    }
  }

  viewOrder(id){
    window.open('/orders/edit/' + id,'_blank');
  }

  toggleSidebar(section){
    switch(section){
      case 'artics':
        if(this.toggleArtics === true){
          this.toggleArtics = false;
        } else {
          this.toggleArtics = true;
        }
        this.toggleDrivers = false;
        this.toggleSubbies = false;
        this.toggleTrailers = false;
        this.toggleUnavailables = false;
        break;
      case 'drivers':
        this.toggleArtics = false;
        if(this.toggleDrivers === true){
          this.toggleDrivers = false;
        } else {
          this.toggleDrivers = true;
        }
        this.toggleSubbies = false;
        this.toggleTrailers = false;
        this.toggleUnavailables = false;
        break;
      case 'subbies':
        this.toggleArtics = false;
        this.toggleDrivers = false;
        if(this.toggleSubbies === true){
          this.toggleSubbies = false;
        } else {
          this.toggleSubbies = true;
        }
        this.toggleTrailers = false;
        this.toggleUnavailables = false;
        break;
      case 'trailers':
        this.toggleArtics = false;
        this.toggleDrivers = false;
        this.toggleSubbies = false;
        if(this.toggleTrailers === true){
          this.toggleTrailers = false;
        } else {
          this.toggleTrailers = true;
        }
        this.toggleUnavailables = false;
        break;
      case 'unavailables':
        this.toggleArtics = false;
        this.toggleDrivers = false;
        this.toggleSubbies = false;
        this.toggleTrailers = false;
        if(this.toggleUnavailables === true){
          this.toggleUnavailables = false;
        } else {
          this.toggleUnavailables = true;
        }
        break;
    }
  }

  deleteRoute(route){
    if(route.jobs !== undefined && route.jobs !== null){
      if(route.jobs.length === 0){
        this.jobAssignmentService.deleteJobAssignment(route.id)
        .pipe(catchError((e)=>{alert('Could not delete route');return e;}))
        .pipe(take(1))
        .subscribe(()=>{
          this.loadContent(null)
        })
      } else {
        alert('You cannot delete a route with assignments')
      }
    } else {
      alert('Something went wrong. Please try again.')
    }
  }

  editRoute(route){
    this.currentRoute = route;
    this.openModal("createArticRoute");
  }

  getContact(unit){
    if(unit.driver !== null){
      return unit.driver.contact;
    } else {
      return 'n/a';
    }
  }

  importDesignated(){
    // const linkedDrivers = this.drivers.filter(f=>f.vehicleId !== -1 && f.vehicleId !== null);
    this.tempVehicles = [];
    this.tempVorVehicles = [];
    this.driverService.getLinkedDrivers()
    .pipe(catchError((e)=>{alert('Could not get Linked Drivers');return e;}))
    .pipe(take(1))
    .subscribe(drivers => {
      const linkedDrivers:any = drivers;

      this.vehicleService.getAllVehicles()
      .pipe(catchError((e)=>{alert('Could not get Linked Drivers');return e;}))
      .pipe(take(1))
      .subscribe(vehicles => {
        this.tempVehicles = vehicles;

        this.vehicleVORService.getVehicleVORsByDate(this.date)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert("vehicle VOR could not be loaded");
          return e;
        }))
        .subscribe((data: VehicleVOR[]) => {
          this.tempVorVehicles = data;

          if(confirm('Add ' + linkedDrivers.length + ' Routes?')){
            let countFails = 0;
            let countSuccess = 0;


            linkedDrivers.forEach(driver => {
              if(this.absenceAndVors.absence.filter(f=>f.driverId === driver.id).length === 0){
                let route = new JobAssignment();

                if(this.tempVehicles.filter(f=>f.id === driver.vehicleId).length > 0){
                  const isVehicleVor = this.tempVorVehicles.filter(f=>f.vehicleId === driver.vehicleId).length;
                  const isTrailerVor = this.tempVorVehicles.filter(f=>f.vehicleId === driver.trailerId).length;

                  if(isVehicleVor === 0){
                    route.vehicleId = driver.vehicleId;
                    route.vehicle.id = driver.vehicleId;
                    if(isTrailerVor === 0){
                      route.trailerId = driver.trailerId;
                      route.trailer.id = driver.trailerId;
                    }
                    route.driverStartTime = '06:00';
                    route.driverId = driver.id;
                    route.driver.id = driver.id;
                    route.name = driver.firstName[0] + '. ' + driver.lastName + '(' + driver.vehicle.registration + ')'

                    route.slotNumber = 0;
                    route.date = this.date;
                    route.orderTypeId = 4; //artics order

                    const foundRoutes = this.routes.filter(f => f.driverId === route.driverId && f.vehicleId === route.vehicleId);

                    if(foundRoutes.length > 0){
                      countFails++;
                    } else {
                      this.jobAssignmentService.createJobAssignment(route)
                      .pipe(catchError((e)=>{alert('Could not save Route');return e;}))
                      .pipe(take(1))
                      .subscribe(() => {
                        countSuccess++;
                        this.loadRoutes(null);
                      })
                    }
                  } else {
                    countFails++;
                  }

                } else {
                  countFails++;
                }

              } else {
                countFails++;
              }

            })
            alert(countFails + ' Routes already on timeline or with absent drivers/vehicles were skipped.');

          }

        });
      })

    })

  }

  changeOrientation(){
    this.timelineSettings.timelineOrientationArtic = !this.timelineSettings.timelineOrientationArtic;
    this.userSettingsService.updatePersonalisation(this.timelineSettings)
    .pipe(catchError((e)=>{alert('Could not update Orientation...');return e;}))
    .pipe(take(1))
    .subscribe((settings:Personalisation)=>{
      this.timelineSettings = settings;
    })
  }
}
