import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { DefectService } from 'src/app/workshop/services/defect.service';
import { VehicleInspectionIntervalService } from 'src/app/workshop/services/vehicleinspections.service';
import { VehicleDetailService } from 'src/app/workshop/services/vehicledetails.service';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Defect } from 'src/app/workshop/models/defect.model';
import { VehicleDetails } from 'src/app/workshop/models/vehicledetails.model';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { VehicleVorService } from 'src/app/vehicle/services/vehicle-vor.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Fitter } from 'src/app/fitter/models/fitter.model';
import { DefectJobService } from 'src/app/timeline-workshop/services/defect-job.service';
import { DefectAssignmentService } from 'src/app/timeline-workshop/services/defect-assignment.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { DocumentStateService } from 'src/app/core/services/document-state.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-defect',
  templateUrl: './edit-defect.component.html',
  styleUrls: ['./edit-defect.component.scss']
})
export class EditDefectComponent implements OnInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;
  vehicleId: number = -1;
  defectId: number = -1;
  vehicle: Vehicle = new Vehicle();
  defect: Defect = new Defect();
  vehicleType: number = -1;
  editToggle:boolean = false;
  canSign:boolean = false;

  fitters: any = [];

  buttons: GridButton[] = [
    {label: 'View', type: 'btn-info', action: (button, record) =>  this.viewDoc(record.id)} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]


  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Filename', field: 'filename'} as GridColumn,
    {active: true, label: 'Filetype', field: 'filetype'} as GridColumn,
    {active: true, label: 'Original Filename', field: 'originalFilename'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [];
  searchFields: any = ['filename','filetype','originalFilename','createdAt','updatedAt'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'filename',
      label: 'Filename',
    } as GridSearchFilter,
    {
      field: 'originalFilename',
      label: 'Original Filename',
    } as GridSearchFilter,
    {
      field: 'filetype',
      label: 'File Type',
    } as GridSearchFilter
  ]

  constructor(
    private route: ActivatedRoute,
    private router:  Router,
    private vehicleService: VehicleService,
    private vehicleDetailService: VehicleDetailService,
    private inspectionService: VehicleInspectionIntervalService,
    private defectService: DefectService,
    private authService: AuthService,
    private vehicleVorService: VehicleVorService,
    private defectJobService: DefectJobService,
    private defectAssignmentService: DefectAssignmentService,
    private modalService: ModalService,
    private documentStateService:DocumentStateService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if(params['id'] !== undefined){
        this.defectId = params['id'];

        this.defectService.getDefectById(this.defectId)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Defect');return e;}))
        .pipe(take(1))
        .subscribe((defect:any) => {
          this.defect = defect;
          this.checkSignStatus();

          // this.gridComponent.filters = [
          //   {field:'entity', condition:'eq',value:'vehicle'},
          //   {field:'entityId', condition:'eq',value:this.defect.vehicleId}
          // ];

          this.gridComponent.getRecordsForEntity();

          this.defectJobService.getJobsByDefectId(this.defect.id)
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Jobs');return e;}))
          .pipe(take(1))
          .subscribe((jobs:any) => {
            jobs.forEach(job =>{
              this.defectAssignmentService.getById(job.defectAssignmentId)
              .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve assignments');return e;}))
              .pipe(take(1))
              .subscribe((assignments:any) => {
                assignments.forEach(ass => {
                  this.fitters.push(ass);
                })
              })
            })

          })
        })
      }
    });

    this.documentStateService.$closedModal.subscribe(() => {
      this.gridComponent.getRecordsForEntity();
    });
  }

  viewDoc(id:number){
    window.open(environment.publicUrl + 'documents/viewdoc/' + id, '_blank');
  }

  loadContent(){
    this.fitters = [];
    this.defectService.getDefectById(this.defectId)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Defect');return e;}))
    .pipe(take(1))
    .subscribe((defect:any) => {
      this.defect = defect;
      this.checkSignStatus();

      this.gridComponent.filters = [
        {field:'entity', condition:'eq',value:'vehicle'},
        {field:'entityId', condition:'eq',value:this.defect.vehicleId}
      ];

      this.gridComponent.getRecordsForEntity();

      this.defectJobService.getJobsByDefectId(this.defect.id)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Jobs');return e;}))
      .pipe(take(1))
      .subscribe((jobs:any) => {
        jobs.forEach(job =>{
          this.defectAssignmentService.getById(job.defectAssignmentId)
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve assignments');return e;}))
          .pipe(take(1))
          .subscribe((assignments:any) => {
            assignments.forEach(ass => {
              this.fitters.push(ass);
            })
          })
        })

      })
    })
  }

  checkSignStatus(){
    if(
      this.defect.started !== null &&
      this.defect.ended !== null &&
      this.defect.finalSignoff === null
    ){
      this.canSign = true;
    }
  }

  save(){
    if(this.validate()){
      if(this.defect.inspectionInterval !== null){
        this.defect.inspectionInterval.id = this.defect.vehicleInspectionIntervalsId;
      }

      this.defect.vehicleCheckArea.id = this.defect.vehicleCheckAreaId;
      this.defect.vehicleSeverity.id = this.defect.vehicleSeverityId;

      if(this.defect.bookedFor === ''){delete this.defect.bookedFor;}

      this.defectService.saveDefect(this.defect)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Defect');return e;}))
      .pipe(take(1))
      .subscribe((result:any) => {
        this.router.navigateByUrl('4workshop/defects')
      })
    } else {
      alert('Please fill in all highlighted details')
    }
  }

  cancel(){
    this.router.navigateByUrl('/4workshop/defects')
  }

  validate(){
    let result = true;

    if(this.defect.vehicleId === -1 || this.defect.vehicleId === null || this.defect.vehicleId === undefined){
      result = false;
    }
    if(this.defect.vehicleCheckAreaId === -1 || this.defect.vehicleCheckAreaId === null || this.defect.vehicleCheckAreaId === undefined){
      result = false;
    }
    if(this.defect.vehicleSeverityId === -1 || this.defect.vehicleSeverityId === null || this.defect.vehicleSeverityId === undefined){
      result = false;
    }
    if(this.defect.description === '' || this.defect.description.length === 0 || this.defect.description === null || this.defect.description === undefined){
      result = false;
    }
    if(this.defect.depotId === -1 || this.defect.depotId === null || this.defect.depotId === undefined){
      result = false;
    }

    return result;
  }

  startDefect(){
    this.defect.started = moment().format('YYYY-MM-DD HH:mm:ss');
    this.defectService.saveDefect(this.defect)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Start Defect');return e;}))
    .pipe(take(1))
    .subscribe(()=>{
      const vor:any = {
        id:-1,
        vehicle: {id:this.defect.vehicleId},
        vehicleId: this.defect.vehicleId,
        startDate: moment().format('YYYY-MM-DD'),
        endDate:moment().add(1,'d').format('YYYY-MM-DD'),
        notes:'Defect started by Workshop',
        deleted:0
      };
      this.vehicleVorService.createVehicleVOR(vor)
      .subscribe(()=>{
        this.loadContent()
        alert('Defect has been started');
      })

    })
  }

  endDefect(){
    this.defect.ended = moment().format('YYYY-MM-DD HH:mm:ss');

    // if(this.defect.vehicleSeverityId > 2){
    //   // is not a VOR, can be auto-signed
    //   this.defect.finalSignoff = 'System';
    // }
    this.defectService.saveDefect(this.defect)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not End Defect');return e;}))
    .pipe(take(1))
    .subscribe(()=>{
      alert('Defect has been Ended');
      this.loadContent();
    })
  }

  signOffDefect(){
    const user = this.authService.getUser();
    this.defect.finalSignoff = user.firstName + ' ' + user.lastName;
    this.defect.signoffDate = moment().format('YYYY-MM-DD HH:mm:ss');
    this.defectService.saveDefect(this.defect)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not End Defect');return e;}))
    .pipe(take(1))
    .subscribe(()=>{
      alert('Sign Off Complete. Vehicle may have outstanding defects stopping it from leaving VOR status.');
      this.cancel();
    })
  }

  parseDateTime(dateTime){
    return moment(dateTime).format('HH:mm - DD/MM/YYYY');
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

}
