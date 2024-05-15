import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Order } from 'src/app/order/models/order.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { filter } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';
import { AccountService } from 'src/app/account/services/account.service';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { DriverService } from 'src/app/driver/services/driver.service';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { JobsByVehicleGraphComponent } from 'src/app/home/partials/jobs-by-vehicle-graph/jobs-by-vehicle-graph.component';

@Component({
  selector: 'app-job-signoff-transport-land',
  templateUrl: './job-signoff-transport-land.component.html',
  styleUrls: ['./job-signoff-transport-land.component.scss']
})
export class JobSignoffTransportLandComponent implements OnInit, AfterViewInit {

  searchFilters: any = {};
  selectedJobs: Job[] = [];
  accounts: Account[] = [];
  drivers: Driver[] =[];
  vehicles: Vehicle[] = [];
  subcontractors: Subcontractor[] = [];
  tips: Account[] = [];
  sites: Account[] = [];


  constructor(private router: Router,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private subcontractorService: SubcontractorService,
    private accountService: AccountService,
    private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    // force component to recreate tasty hack
    this.route.params.subscribe(val => {
      if (localStorage.getItem('MJL_LAND_SIGNOFF_TRANSPORT_SEARCH') !== '') {
        this.searchFilters = JSON.parse(localStorage.getItem('MJL_LAND_SIGNOFF_TRANSPORT_SEARCH'));

        if (this.searchFilters === null || this.searchFilters === undefined || this.searchFilters === '') {
          this.searchFilters = {};
        }
        this.search();
      }

    });

  }
  ngOnInit(): void {

    this.accountService.getAllAccountsForCustomerAndProspect()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load customers');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.accounts = accounts;
    });

    this.subcontractorService.getAllSubcontractors()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load subbies');
      return e;
    }))
    .subscribe((subcontractors: Subcontractor[]) => {
      this.subcontractors = subcontractors;
    });

    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load subbies');
      return e;
    }))
    .subscribe((vehicles: any) => {
      this.vehicles = vehicles;
    });

    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load drivers');
      return e;
    }))
    .subscribe((drivers: any) => {
      this.drivers = drivers;
    });

    this.accountService.getAllTips()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load tips');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.tips = accounts;
    });
  }

  currentSignOffStatus: string = '';
  @ViewChild(GridComponent, { static: false }) gridComponent: GridComponent;

  statuses: string[] = [
    'N/A',
    'Not tipped',
    'Rescheduled',
    'Charges Only',
    'Transport sign off',
    'Problematic'
  ];

  orderType: string[] = [
    'Skip',
    'Trade Waste',
    'Tipper',
    'Artic',
    'Grab',
    'Concrete',
    'Sweeper'

  ]
  buttons: GridButton[] = [
    { label: 'Sign off', link: '/job-signoff/land/view/:id', type: 'btn-primary' } as GridButton,
    { label: 'Delete', link: '/job-signoff/land/delete/:id', type: 'btn-danger', } as GridButton,
  ]
  columns: GridColumn[] = [
    { active: true, label: '#', field: 'id' } as GridColumn,
    { active: true, label: 'Parent Job Id', field: 'order.id' } as GridColumn,
    { active: true, label: 'Date', field: 'date', value: v => moment(v).format('DD/MM/YYYY') } as GridColumn,
    { active: true, label: 'Time', field: 'order.time' } as GridColumn,
    { active: true, label: 'Account', field: 'order.account.name' } as GridColumn,
    { active: true, label: 'Site', field: 'order.site.name', value: (v, r) => this.getAddressForOrder(r.order) } as GridColumn,
    { active: true, label: 'Grade', field: 'order.grade.name', value: (v, r) => !r.order.grade.name ? 'N/A' : r.order.grade.name } as GridColumn,
    { active: true, label: 'Qty', field: 'qty' } as GridColumn,
    { active: true, label: 'Order Type', field: 'order.orderTypeId', value: (v, r) => this.getOrdeTypeName(r.order.orderTypeId) } as GridColumn,
    { active: true, label: 'Driver', field: 'jobAssignment.driver.firstName', value: (v, r) => { if (r.jobAssignment.driverId !== -1) { return r.jobAssignment.driver.firstName + ' ' + r.jobAssignment.driver.lastName } else { return 'Subcontractor' } } } as GridColumn,
    { active: true, label: 'Vehicle', field: 'jobAssignment.vehicle.registration', value: (v, r) => { if (r.jobAssignment.vehicleId !== -1) { return r.jobAssignment.vehicle.registration } else { return 'Subcontractor' } } } as GridColumn,
    { active: true, label: 'Subcontractor', field: 'jobAssignment.subcontractor.name', value: (v, r) => { if (r.jobAssignment.subcontractorId !== -1) { return r.jobAssignment.subcontractor.name } else { return 'N/A' } } } as GridColumn,
    { active: true, label: 'Subcontractor Reg', field: 'subcontractorReg'} as GridColumn,
    { active: true, label: 'Status', field: 'jobSignOffStatusId', value: (v, r) => this.getStatusName(v) } as GridColumn,
    { active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss') } as GridColumn,
    { active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss') } as GridColumn
  ];

  // Show approved and signed off jobs.
  // Hide deleted and pending.
  filters: GridFilter[] = [
    {
      field: 'jobStatusId',
      condition: 'in',
      value: [2, 4, 5]
    } as GridFilter,

    // only land jobs
    {
      field: 'order.orderTypeId',
      condition: 'in',
      value: [3,4, 5, 6, 7, 9]
    } as GridFilter,
  ]

  searchFields: any = ['date', 'time', 'order.account.name', 'order.containerType.name', 'order.site.name', 'order.containerSizeType.size', 'order.grade.name', 'jobAssignment.driver.firstName', 'jobAssignment.driver.lastName', 'jobAssignment.vehicle.registration'];

  searchFiltersGrid: GridSearchFilter[] = [
    {
      field: 'date',
      label: 'Date',
    } as GridSearchFilter,
    {
      field: 'time',
      label: 'Time',
    } as GridSearchFilter,
    {
      field: 'order.account.name',
      label: 'Account Name',
    } as GridSearchFilter,
    {
      field: 'order.site.name',
      label: 'Site Name',
    } as GridSearchFilter,

    {
      field: 'order.grade.name',
      label: 'Grade',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.driver.firstName',
      label: 'Driver First Name',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.driver.lastName',
      label: 'Driver Last Name',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.vehicle.registration',
      label: 'Vehicle registration',
    } as GridSearchFilter,
    {
      field: 'jobSignOffStatusId',
      label: 'Job Signoff Status',
    } as GridSearchFilter,
  ]

  getAddressForOrder(order: Order): string {
    let address: string = '';

    if (order.site.name.trim() !== "") {
      address += ',' + order.site.name;
    }

    if (order.site.shippingAddress1.trim() !== "") {
      address += ',' + order.site.shippingAddress1;
    }

    if (order.site.shippingAddress2.trim() !== "") {
      address += ',' + order.site.shippingAddress2;
    }

    if (order.site.shippingCity.trim() !== "") {
      address += ',' + order.site.shippingCity;
    }

    if (order.site.shippingCountry.trim() !== "") {
      address += ',' + order.site.shippingCountry;
    }

    if (order.site.shippingPostCode.trim() !== "") {
      address += ',' + order.site.shippingPostCode;
    }

    return address.substring(1);
  }

  onCheckboxSelected($event) {
    if ($event.checked) {
      this.selectedJobs.push($event.record);
    } else {
      this.selectedJobs = this.selectedJobs.filter(j => j.id !== $event.record.id);
    }
  }


  getRowColor(record) {
    if (record.jobSignOffStatusId === 5 || record.jobSignOffStatusId === 6) {
      return 'pink'
    }
    else if (record.jobSignOffStatusId === 4 || record.jobSignOffStatusId === 3) {
      return '#27ae60';
    }
    else {
      return '';
    }
  }

  onSignOffClicked() {
    if (this.selectedJobs.length === 0) {
      alert("You must select at least one job for signoff");
      return;
    }


    localStorage.setItem('WS_MJL_LAND_SIGNOFF_LIST', JSON.stringify(this.selectedJobs));


    this.router.navigateByUrl('/job-signoff/land/view/' + this.selectedJobs[0].id);
  }

  isSighOffButtonVisible(record, button) {

    // If it's transport sign off or charges only don't show sign off button
    return [3, 4].indexOf(record.jobSignOffStatusId) === -1;
  }

  getStatusName(statusId) {
    return this.statuses[statusId] === undefined ? 'Pending' : this.statuses[statusId];
  }


  getOrdeTypeName(orderTypeId) {
    return this.orderType[orderTypeId - 1] === undefined ? 'N/A' : this.orderType[orderTypeId - 1];
  }

  clear() {
    this.searchFilters = {};
    this.search();
  }

  deleteAll() {
    let jobIds = this.selectedJobs.map(sj => sj.id);
    this.router.navigateByUrl('/job-signoff/land/deleteall/' + jobIds.join(','));
  }


  setVehicleTypeFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'jobAssignment.vehicleId');

    if(this.searchFilters['vehicleType'] && this.searchFilters['vehicleType'] !== '') {
      if(this.searchFilters['vehicleType'] === 'subcontractors') {
        this.gridComponent.filters.push({
          condition: 'eq',
          value: -1,
          field: 'jobAssignment.vehicleId',
        });
      } else if(this.searchFilters['vehicleType'] === 'own') {
        this.gridComponent.filters.push({
          condition: 'ne',
          value: -1,
          field: 'jobAssignment.vehicleId',
        });
      }
    }

  }
  setTicketTypeFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'transportSignOffNotes');

    if(this.searchFilters['ticketType'] && this.searchFilters['ticketType'] !== '') {
      if(this.searchFilters['ticketType'] === 'has') {
        this.gridComponent.filters.push({
          condition: 'ne',
          value: '',
          field: 'transportSignOffNotes',
        });
      } else if(this.searchFilters['ticketType'] === 'not') {
        this.gridComponent.filters.push({
          condition: 'eq',
          value: '',
          field: 'transportSignOffNotes',
        });
      }
    }

  }
  loadSites(accountId: number=-1) {
    this.accountService.getAllSitesForAccount(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load sites');
      return e;
    }))
    .subscribe((sites: Account[]) => {
      this.sites = sites;
    })
  }



  search() {
    this.setVehicleTypeFilter();
    this.setTicketTypeFilter();
    //this.setSearchFieldOnGrid('date', '') -dates
    this.setSearchFieldOnGrid('subcontractorReg', this.searchFilters['subcontractorReg']);
    this.setSearchFieldOnGrid('jobAssignment.vehicle.registration', this.searchFilters['vehicle'], 'cont');
    this.setSearchFieldOnGrid('jobAssignment.driver.firstName', this.searchFilters['driver'], 'cont');
    this.setSearchFieldOnGrid('order.tipSite.name', this.searchFilters['tipSite']);
    this.setSearchFieldOnGrid('order.account.id',+this.searchFilters['customer'], 'eq');
    this.setSearchFieldOnGrid('id', this.searchFilters['jobNumber']);
    this.setSearchFieldOnGrid('order.poNumber', this.searchFilters['orderRef'], 'cont');
    this.setSearchFieldOnGrid('jobAssignment.subcontractor.name', this.searchFilters['subcontractor'], 'cont');
    this.setSearchFieldOnGrid('order.id', this.searchFilters['parentJobId']);
    this.setSearchFieldOnGrid('order.tipSite.name', this.searchFilters['tipSite']);


    this.setDateRangeFilter();
    this.setSignOffFiltersSearch();

    localStorage.setItem('MJL_LAND_SIGNOFF_TRANSPORT_SEARCH', JSON.stringify(this.searchFilters));

    this.gridComponent.getRecordsForEntity();
    this.gridComponent.onPaginationPageClicked(1);
  }

  setDateRangeFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'date');
    if (this.searchFilters['startDate'] && this.searchFilters['startDate'] !== '' && this.searchFilters['endDate'] && this.searchFilters['endDate'] !== '') {
      this.gridComponent.filters.push({
        condition: 'gte',
        value: this.searchFilters['startDate'],
        field: 'date',
      });
      this.gridComponent.filters.push({
        condition: 'lte',
        value: this.searchFilters['endDate'],
        field: 'date',
      });
    }
  }

  setSignOffFiltersSearch() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'jobStatusId' && f.field !== 'jobSignOffStatusId');

    if (this.searchFilters.status === '' || !this.searchFilters.status) {
      this.gridComponent.filters.push(
        {
          field: 'jobStatusId',
          condition: 'in',
          value: [2, 4, 5]
        } as GridFilter,

      )
    } else if (this.searchFilters.status === 'signed') {

      this.gridComponent.filters.push(
        {
          condition: 'in',
          field: 'jobSignOffStatusId',
          value: <any>([4]),
        } as GridFilter,
      )
    } else {
      // off
      this.gridComponent.filters.push(
        {
          field: 'jobStatusId',
          condition: 'in',
          value: [2, 4, 5]
        } as GridFilter
      );

      this.gridComponent.filters.push(
        {
          field: 'jobSignOffStatusId',
          condition: 'notin',
          value: [4, 3],
        } as GridFilter,
      )
    }
  }

  setSearchFieldOnGrid(fieldName, value, operator = 'eq') {

    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== fieldName);
    if (value && value !== '') {
      this.gridComponent.filters.push({
        condition: operator,
        value: value,
        field: fieldName,
      })
    }
  }

  // setSignoffStatus(status: string) {
  // this.currentSignOffStatus = status;


  // if(this.currentSignOffStatus !== '') {

  //   if(this.currentSignOffStatus === 'signed') {
  //   this.gridComponent.filters = [
  //     {
  //       condition: 'in',
  //       field: 'jobSignOffStatusId',
  //       value: <any>([4]),
  //     }  as GridFilter,
  //     {
  //       field: 'order.orderTypeId',
  //       condition: 'in',
  //       value: [3,5,6,7,9]
  //     } as GridFilter,
  //   ]

  //   this.gridComponent.getRecordsForEntity();
  //   this.gridComponent.onValueChanged();
  //   this.gridComponent.onPaginationPageClicked(1);
  //   this.clear();

  //   } else {
  //     this.gridComponent.filters =  [
  //       {
  //         field: 'jobStatusId',
  //         condition: 'in',
  //         value: [2,4,5]
  //       } as GridFilter,

  //       // only land jobs
  //       {
  //         field: 'order.orderTypeId',
  //         condition: 'in',
  //         value: [3,5,6,7,9]
  //       } as GridFilter,

  //       {
  //         field: 'jobSignOffStatusId',
  //         condition: 'notin',
  //         value: [4,3],
  //       } as GridFilter,
  //     ];


  //   this.gridComponent.getRecordsForEntity();
  //   this.gridComponent.onValueChanged();
  //   this.gridComponent.onPaginationPageClicked(1);
  //   this.clear();
  // }
  //   }
  //   else {
  //     this.gridComponent.filters =  [
  //       {
  //         field: 'jobStatusId',
  //         condition: 'in',
  //         value: [2,4,5]
  //       } as GridFilter,

  //       // only land jobs
  //       {
  //         field: 'order.orderTypeId',
  //         condition: 'in',
  //         value: [3,5,6,7,9]
  //       } as GridFilter,
  //     ];
  //     this.gridComponent.getRecordsForEntity();
  //     this.gridComponent.onValueChanged();
  //     this.gridComponent.onPaginationPageClicked(1);
  //     this.clear();
  //   }
  // }
}
