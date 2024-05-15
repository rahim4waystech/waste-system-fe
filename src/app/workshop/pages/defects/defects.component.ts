import { Component, OnInit, ViewChildren, QueryList} from '@angular/core';
import { DefectService } from '../../services/defect.service';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { ReportingService } from 'src/app/reporting/services/reporting.service';

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.scss']
})
export class DefectsComponent implements OnInit {
  @ViewChildren(GridComponent)
  children!: QueryList<GridComponent>;

  childList: any = {};
  displayDate = moment().format('LL');

  openDefects: any = [];
  openDefectsCount: number = 0;
  inProgressDefects: any = [];
  inProgressCount: number = 0;
  awaitingSignoffDefects: any = [];
  awaitingSignoffCount: number = 0;
  closedDefects: any = [];
  closedCount: number = 0;

  openDefectsFilters: GridFilter[] = [
    {field:'started', condition:'isnull',value:''},
    {field:'ended', condition:'isnull',value:''}
  ];
  inProgressDefectsFilters: GridFilter[] = [
    {field:'started', condition:'notnull',value:''},
    {field:'ended', condition:'isnull',value:''},
    {field:'driverReportStatus', condition:'lte',value:'1'}
  ];
  awaitingSignoffDefectsFilters: GridFilter[] = [
    {field:'started', condition:'notnull',value:''},
    {field:'ended', condition:'notnull',value:''},
    {field:'finalSignoff', condition:'isnull',value:''},
    {field:'driverReportStatus', condition:'lte',value:'1'}
  ];
  closedDefectsFilters: GridFilter[] = [
    {field:'started', condition:'notnull',value:''},
    {field:'ended', condition:'notnull',value:''},
    {field:'finalSignoff', condition:'notnull',value:''},
    {field:'driverReportStatus', condition:'lte',value:'1'}
  ];


  openDefectsSearchFilters: any = [
    {field: 'id',label: 'Defect Id',} as GridSearchFilter,
    {field: 'vehicle.registration',label: 'Registration',} as GridSearchFilter,
    {field: 'decription',label: 'Description',} as GridSearchFilter,
    {field: 'driver.firstName',label: 'Driver First Name',} as GridSearchFilter,
    {field: 'driver.lastName',label: 'Driver Surname',} as GridSearchFilter,
    {field: 'bookedFor',label: 'Booking Date',} as GridSearchFilter,
  ];
  inProgressDefectsSearchFilters: any = [
    {field: 'id',label: 'Defect Id',} as GridSearchFilter,
    {field: 'vehicle.registration',label: 'Registration',} as GridSearchFilter,
    {field: 'decription',label: 'Description',} as GridSearchFilter,
    {field: 'driver.firstName',label: 'Driver First Name',} as GridSearchFilter,
    {field: 'driver.lastName',label: 'Driver Surname',} as GridSearchFilter,
    {field: 'bookedFor',label: 'Booking Date',} as GridSearchFilter,
  ];
  awaitingSignoffDefectsSearchFilters: any = [
    {field: 'id',label: 'Defect Id',} as GridSearchFilter,
    {field: 'vehicle.registration',label: 'Registration',} as GridSearchFilter,
    {field: 'decription',label: 'Description',} as GridSearchFilter,
    {field: 'driver.firstName',label: 'Driver First Name',} as GridSearchFilter,
    {field: 'driver.lastName',label: 'Driver Surname',} as GridSearchFilter,
    {field: 'started',label: 'Defect Started',} as GridSearchFilter,
    {field: 'ended',label: 'Defect Ended',} as GridSearchFilter,
    {field: 'bookedFor',label: 'Booking Date',} as GridSearchFilter,
  ];
  closedDefectsSearchFilters: any = [
    {field: 'id',label: 'Defect Id',} as GridSearchFilter,
    {field: 'vehicle.registration',label: 'Registration',} as GridSearchFilter,
    {field: 'decription',label: 'Description',} as GridSearchFilter,
    {field: 'driver.firstName',label: 'Driver First Name',} as GridSearchFilter,
    {field: 'driver.lastName',label: 'Driver Surname',} as GridSearchFilter,
    {field: 'started',label: 'Defect Started',} as GridSearchFilter,
    {field: 'ended',label: 'Defect Ended',} as GridSearchFilter,
    {field: 'bookedFor',label: 'Booking Date',} as GridSearchFilter,
  ];


  openDefectsSearchFields: any = ['id','vehicle.registration','description','driver.firstName','driver.lastName','bookedFor']
  inProgressDefectsSearchFields: any = ['id','vehicle.registration','description','driver.firstName','driver.lastName','bookedFor']
  awaitingSignoffDefectsSearchFields: any = ['id','vehicle.registration','description','driver.firstName','driver.lastName','bookedFor']
  closedDefectsSearchFields: any = ['id','vehicle.registration','description','driver.firstName','driver.lastName','bookedFor']


  openDefectsButtons: GridButton[] = [
    {label: '<i class="fas fa-eye"></i>', link: '/4workshop/defect/:id', type: 'btn-info',} as GridButton
  ]
  inProgressDefectsButtons: GridButton[] = [
    {label: '<i class="fas fa-eye"></i>', link: '/4workshop/defect/:id', type: 'btn-info',} as GridButton
  ]
  awaitingSignoffDefectsButtons: GridButton[] = [
    {label: '<i class="fas fa-pen"></i>', link: '/4workshop/defect/:id', type: 'btn-info',} as GridButton,
  ]
  closedDefectsButtons: GridButton[] = [
    {label: '<i class="fas fa-eye"></i>', link: '/4workshop/defect/:id', type: 'btn-info',} as GridButton
  ]

  openDefectsColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Reporter', field: 'driverId', value:(v, r) => !r.driver ? 'N/A' : r.driver.firstName + ' ' + r.driver.lastName} as GridColumn,
    {active: true, label: 'Booked For', field: 'bookedFor', value:(v,r) => !r.bookedFor ? 'N/A' : moment(r.bookedFor).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Severity', field: 'vehicleSeverity', value:(v,r)=> r.vehicleSeverity.severity + ' ('+r.vehicleSeverity.notes+')'} as GridColumn
  ];
  inProgressDefectsColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Reporter', field: 'driverId', value:(v, r) => !r.driver ? 'N/A' : r.driver.firstName + ' ' + r.driver.lastName} as GridColumn,
    {active: true, label: 'Booked For', field: 'bookedFor', value:(v,r) => !r.bookedFor ? 'N/A' : moment(r.bookedFor).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Severity', field: 'vehicleSeverity', value:(v,r)=> r.vehicleSeverity.severity + ' ('+r.vehicleSeverity.notes+')'} as GridColumn
  ];
  awaitingSignoffDefectsColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Reporter', field: 'driverId', value:(v, r) => !r.driver ? 'N/A' : r.driver.firstName + ' ' + r.driver.lastName} as GridColumn,
    {active: true, label: 'Booked For', field: 'bookedFor', value:(v,r) => !r.bookedFor ? 'N/A' : moment(r.bookedFor).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Started', field: 'started', value:(v,r)=> !r.started ? 'Not Started': moment(r.started).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Ended', field: 'ended', value:(v,r)=> !r.ended ? 'Not Finished': moment(r.ended).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];
  closedDefectsColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Reporter', field: 'driverId', value:(v, r) => !r.driver ? 'N/A' : r.driver.firstName + ' ' + r.driver.lastName} as GridColumn,
    {active: true, label: 'Signed Off', field: 'finalSignoff'} as GridColumn,
    {active: true, label: 'Booked For', field: 'bookedFor', value:(v,r) => !r.bookedFor ? 'N/A' : moment(r.bookedFor).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Started', field: 'started', value:(v,r)=> !r.started ? 'Not Started': moment(r.started).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Ended', field: 'ended', value:(v,r)=> !r.ended ? 'Not Finished': moment(r.ended).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  defectShortlist: any = [];
  noIssue = 0;
  noIssuePercent = 0;
  reportedIssue = 0;
  reportedIssuePercent = 0;
  vorIssue = 0;
  vorIssuePercent = 0;

  defects: any = [];
  startDate = moment().subtract(3,'w');
  endDate = moment();

  constructor(
    private defectService: DefectService,
    private reportingService: ReportingService
  ) { }

  ngOnInit(): void {
    this.defectService.getAllDefectsList()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Defects');return e;}))
    .pipe(take(1))
    .subscribe(defects => {
      this.defectShortlist = defects;
    })

    this.reportingService.getDefectStatus()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get statistics');return e;}))
    .pipe(take(1))
    .subscribe(stats => {
      this.noIssue = stats[0].total - stats[0].openDefects;
      this.reportedIssue = stats[0].openDefects;
      this.vorIssue = stats[0].openVor;
      this.noIssuePercent = (this.noIssue / stats[0].total)*100;
      this.reportedIssuePercent = (this.reportedIssue / stats[0].total)*100;
      this.vorIssuePercent = (this.vorIssue / stats[0].total)*100;
    })
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
