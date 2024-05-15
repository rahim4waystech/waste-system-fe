import { Component, OnInit } from '@angular/core';
import { VehicleCheckService } from '../../services/vehiclechecks.service';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { VehicleCheckReport } from '../../models/vehiclecheckreport.model';
import { Defect } from '../../models/defect.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { DefectStateService } from '../../services/defect-state.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-driver-report',
  templateUrl: './driver-report.component.html',
  styleUrls: ['./driver-report.component.scss']
})
export class DriverReportComponent implements OnInit {
  reports:any = [];
  date: string = moment().format('YYYY-MM-DD');
  isDatePickerVisible:boolean = false;

  driverDefects: any = [];
  statusId: number = 1;

  newDefect:Defect = new Defect();
  selectedReport:VehicleCheckReport = new VehicleCheckReport();

  buttons: GridButton[] = [
    // {label: 'Edit', link: '/vehicles/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Check', field: 'vehicleCheck.checkInformation'} as GridColumn,
    {active: true, label: 'Driver', field: 'driver.lastName'} as GridColumn,
    {active: true, label: 'Rejection Reason', field: 'rejectionNote'} as GridColumn,
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [{field:'checkStatusId', condition:'eq',value:'2'}]

  searchFields: any = ['registration'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'vehicle.registration',
      label: 'Registration',
    } as GridSearchFilter,
  ]

  constructor(
    private vehicleCheckService:VehicleCheckService,
    private modalService:ModalService,
    private defectStateService: DefectStateService
  ) { }

  ngOnInit(): void {
    this.loadContent();

    this.defectStateService.$closedDefectModal.subscribe(() => {
      this.loadContent();
    })
  }

  loadContent(){
    this.selectedReport = new VehicleCheckReport();
    this.newDefect = new Defect();

    this.vehicleCheckService.getDriverChecksGroupByDate(this.date)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Reports');return e;}))
    .pipe(take(1))
    .subscribe(reports => {
      this.reports = reports;

      this.reports.forEach(item => {
        item.createdAt = moment(item.createdAt).format('HH:mm:ss');

        this.vehicleCheckService.getDriverChecksByGroupId(item.id)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}('Could not get Reports');return e;}))
        .pipe(take(1))
        .subscribe((replies:any) => {
          item.pass = replies.filter(f=>f.result).length;
          item.fail = replies.filter(f=>!f.result).length;
        })
      })
    })
    this.loadChecks();
  }

  loadChecks(){
    this.vehicleCheckService.getDriverChecksByStatus(this.statusId)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}('Could not get Reports');return e;}))
    .pipe(take(1))
    .subscribe((data) => {
      this.driverDefects = data;
      this.driverDefects.forEach(defect => {
        defect.createdAt = moment(defect.createdAt).format('DD/MM/YYYY');
      })
    })
  }

  nextDay(){
    this.date = moment(this.date,'YYYY-MM-DD').add(1,'d').format('YYYY-MM-DD');
    this.loadContent();
  }

  lastDay(){
    this.date = moment(this.date,'YYYY-MM-DD').subtract(1,'d').format('YYYY-MM-DD');
    this.loadContent();
  }

  onDateSelected($event) {
    // make sure inital setting of value doesn't hide the datepicker
    if(moment(this.date).unix() !== moment($event).unix()) {
      this.isDatePickerVisible = false;
    }

    this.date = moment($event).format('YYYY-MM-DD');

    this.loadContent();
  }

  formatDate(date){
    return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  approveDefect(report: VehicleCheckReport){
    this.newDefect = new Defect();

    this.newDefect.vehicleId = report.vehicleId;
    this.newDefect.vehicle = report.vehicle;
    this.newDefect.driverId = report.driverId
    this.newDefect.driver = {id: report.driverId} as any;
    this.newDefect.vehicleCheckAreaId = report.vehicleCheck.vehicleCheckAreaId;
    this.newDefect.vehicleCheckArea = {id:report.vehicleCheck.vehicleCheckAreaId} as any;
    this.newDefect.driverReportStatus = 1;
    this.newDefect.defectStatusId = 1;
    this.newDefect.defectStatus = {id:1} as any;
    this.newDefect.started = null;
    this.newDefect.ended = null;
    this.newDefect.description = report.description;
    this.newDefect.vehicleSeverityId = report.vehicleCheck.severity;
    this.newDefect.vehicleSeverity = {id:report.vehicleCheck.severity} as any;
    this.selectedReport = report;

    this.modalService.open('defect-modal');
  }

  showDocs(report:VehicleCheckReport){
    this.selectedReport = report;
    this.modalService.open('defectImageModal');
  }

  rejectDefect(report:VehicleCheckReport){
    report.checkStatusId = 2;

    this.selectedReport = report;
    this.modalService.open('defectRejectModal');
  }

}
