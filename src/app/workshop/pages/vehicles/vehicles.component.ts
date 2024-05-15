import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { VehicleDetailService } from '../../services/vehicledetails.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { catchError, take } from 'rxjs/operators';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { QueryService } from 'src/app/core/services/query.service';
import { ReportingService } from 'src/app/reporting/services/reporting.service';

@Component({
  selector: 'app-workshop-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class WorkshopVehiclesComponent implements OnInit {
  @ViewChildren(GridComponent)
  children!: QueryList<GridComponent>;

  childList: any = {};

  // buttons: GridButton[] = [
  //   {label: 'View', link: '4workshop/vehicle/:id', type: 'btn-success',} as GridButton,
  //   {label: 'Add Defect', link: '4workshop/defect/new/:id', type: 'btn-warning',} as GridButton
  // ]
  // columns: GridColumn[] = [
  //   {active: true, label: '#', field: 'id'} as GridColumn,
  //   {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
  //   {active: true, label: 'Type', field: 'vehicle.vehicle.vehicleTypeId',value:(v,r)=>{return this.getVehicleType(r)}} as GridColumn,
  //   {active: true, label: 'VIN Number', field: 'vehicle.vinNumber'} as GridColumn,
  //   {active: true, label: 'Is Active', field: 'vehicle.vehicle.active', value: (v,r) => {return this.getBadge(v,r)}} as GridColumn,
  // ];
  //
  // // Org filter handled at API level
  // filters: GridFilter[] = [];
  //
  // searchFields: any = ['vinNumber','registration','make','model','vehicleType','depot.name'];
  //
  // searchFilters: GridSearchFilter[] = [
  //   {
  //     field: 'vehicle.vinNumber',
  //     label: 'VIN Number',
  //   } as GridSearchFilter,
  //   {
  //     field: 'vehicle.registration',
  //     label: 'Registration',
  //   } as GridSearchFilter,
  //   {
  //     field: 'vehicle.make',
  //     label: 'Make',
  //   } as GridSearchFilter,
  //   {
  //     field: 'vehicle.model',
  //     label: 'Model',
  //   } as GridSearchFilter,
  //   {
  //     field: 'vehicleType',
  //     label: 'Vehicle Type',
  //   } as GridSearchFilter,
  //   {
  //     field: 'depot.name',
  //     label: 'Depot'
  //   } as GridSearchFilter
  // ]

  vehicleButtons: GridButton[] = [
    {label: 'View', link: '4workshop/vehicle/:id', type: 'btn-success',} as GridButton,
    {label: 'Add Defect', link: '4workshop/defect/new/:id', type: 'btn-warning',} as GridButton
  ]
  vehicleColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'registration'} as GridColumn,
    {active: true, label: 'VIN Number', field: 'vinNumber'} as GridColumn,
    {active: true, label: 'Depot', field: 'depot.name'} as GridColumn,
    {active: true, label: 'Vehicle Type', field: 'vehicleType.name'} as GridColumn,
    {active: true, label: 'Is Active', field: 'active', value: v => v ? '<span class="badge badge-success">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,
  ];

  // Org filter handled at API level
  vehicleFilters: GridFilter[] = []

  vehicleSearchFields: any = ['vinNumber','registration','make','model'];

  vehicleSearchFilters: GridSearchFilter[] = [
    {
      field: 'vinNumber',
      label: 'VIN Number',
    } as GridSearchFilter,
    {
      field: 'registration',
      label: 'Registration',
    } as GridSearchFilter,
    {
      field: 'make',
      label: 'Make',
    } as GridSearchFilter,
    {
      field: 'model',
      label: 'Model',
    } as GridSearchFilter
  ]

  upcoming = [
    {type: '6 Week Inspection', registration:'TR6 FTW', dueDate:'07/12/20',defectId:1},
    {type: 'MOT', registration:'GT7 FTW', dueDate:'07/12/20',defectId:1},
    {type: 'Booked for repairs', registration:'P97 FTW', dueDate:'08/12/20',defectId:1},
    {type: '6 Week Inspection', registration:'T23 FTW', dueDate:'09/12/20',defectId:1},
    {type: 'ADR Certification Inspection', registration:'U65 FTW', dueDate:'10/12/20',defectId:1},
    {type: '6 Week Inspection', registration:'RT5 FTW', dueDate:'10/12/20',defectId:1},
  ]

  showIncomplete:Boolean = false;
  unsetCount: number = 0;
  vehicleTypes:any = [];

  totalFleet: number = 0;
  totalDefects: number = 0;
  vorDefects: number = 0;

  totalVehicles = 0;
  noIssue = 0;
  noIssuePercent = 0;
  notBadIssues = 0;
  notBadIssuesPercent = 0;
  reportedIssue = 0;
  vorIssue = 0;
  vorIssuePercent = 0;

  constructor(
    private vehicleDetailService:VehicleDetailService,
    private vehicleService:VehicleService,
    private reportingService: ReportingService,
    private router:Router,
    private queryService:QueryService
  ) { }

  ngOnInit(): void {
    this.vehicleDetailService.checkForUnsetVehicles().subscribe(count => {
      this.unsetCount = count.length;
    })

    this.vehicleDetailService.getAllVehicles().subscribe(data => {
    })

    this.vehicleService.getAllVehicleTypes()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve VehicleTypes');return e;}))
    .pipe(take(1))
    .subscribe(vehicleTypes => {
      this.vehicleTypes = vehicleTypes;
    })

    this.reportingService.getDefectStatus()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get statistics');return e;}))
    .pipe(take(1))
    .subscribe(stats => {
      this.noIssue = stats[0].total - stats[0].openDefects;
      this.totalVehicles = stats[0].total;
      this.reportedIssue = stats[0].openDefects;
      this.vorIssue = stats[0].openVor;
      this.notBadIssues = this.reportedIssue - this.vorIssue;
      this.noIssuePercent = (this.noIssue / stats[0].total)*100;
      this.notBadIssuesPercent = (this.notBadIssues / stats[0].total)*100;
      this.vorIssuePercent = (this.vorIssue / stats[0].total)*100;

    })
  }

  clickedNew(){
    this.router.navigateByUrl('4workshop/vehicle/new');
  }

  getVehicleType(input){
    return this.vehicleTypes.filter(f=>f.id === input.vehicle.vehicleTypeId)[0].name;
  }

  getBadge(v,r){
    if(r.vehicle.active){
      return '<span class="badge badge-success">Active</span>';
    } else {
      return '<span class="badge badge-danger">Inactive</span>';
    }
  }

  ngAfterViewInit(){
    if(this.children !== undefined){
      this.childList = this.children['_results'];
    }
  }

  getCount(index:number){
    if(this.children !== undefined){
     return this.childList[index].paginationService.totalRecords;
   } else {
     return 0;
   }
  }

}
