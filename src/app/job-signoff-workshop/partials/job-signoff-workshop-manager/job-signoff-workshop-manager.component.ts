import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { DefectJob } from 'src/app/timeline-workshop/models/defect-job.model';
import { DefectJobService } from 'src/app/timeline-workshop/services/defect-job.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Defect } from 'src/app/workshop/models/defect.model';

@Component({
  selector: 'app-job-signoff-workshop-manager',
  templateUrl: './job-signoff-workshop-manager.component.html',
  styleUrls: ['./job-signoff-workshop-manager.component.scss']
})
export class JobSignoffWorkshopManagerComponent implements OnInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  buttons: GridButton[] = [
    {label: 'Sign off', link: '/4workshop/signoff/view/:id', trigger:this.isSighOffButtonVisible, type: 'btn-primary'} as GridButton,
    {label: 'Parts', type: 'btn-info', action: (button, record) => this.openModal('assignStockModal',record)} as GridButton,
    {label: 'View defect', link: '/4workshop/defect/:id', type: 'btn-primary'} as GridButton,

  ]
  selectedJobs: Defect[] = [];
  columns: GridColumn[] = [
    // {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Started', field: 'started'} as GridColumn,
    {active: true, label: 'Ended', field: 'ended'} as GridColumn,
    {active: true, label: 'Signed Off by', field: 'finalSignoff'} as GridColumn,
    {active: true, label: 'Signed Off date', field: 'signoffDate'} as GridColumn,
    {active: true, label: 'Check Area', field: 'vehicleCheckArea.name'} as GridColumn,
    {active: true, label: 'PO Number', field: 'poNumber'} as GridColumn,
    {active: true, label: 'Booked For',field: 'bookedFor', value: v => !v ? 'N/A' : moment(v).format('DD/MM/YYYY')},
    {active: true, label: 'Vehicle', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Show approved and signed off jobs.
  // Hide deleted and pending.
  filters: GridFilter[] = [
    {
      condition: 'notnull',
      field: 'started',
      value: ''
    } as GridFilter
  ]

  searchFields: any = [];

  searchFilters: GridSearchFilter[] = [
  ]

  defect: Defect = new Defect();
  vehicle: Vehicle = new Vehicle();

  constructor(
    private jobService: JobService,
    private defectJobService: DefectJobService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    // this.partsStateService.$closedModal.subscribe(() => {
    //   this.gridComponent.getRecordsForEntity();
    // });
  }

  onCheckboxSelected($event) {
    if($event.checked) {
      this.selectedJobs.push($event.record);
    } else {
      this.selectedJobs = this.selectedJobs.filter(j => j.id !== $event.record.id);
    }
   }

   onSignOffButtonClicked() {
    if(this.selectedJobs.length === 0) {
      alert("You must select at least one job for signoff");
      return;
    }

    this.selectedJobs.forEach((job: Defect) => {
     job.ended = moment().format('YYYY-MM-DD');
     job.defectStatusId = 6;
     job.defectStatus = {id: 6} as any;
    });

    // this.defectJobService.bulkUpdateJob(this.selectedJobs)
    // .pipe(take(1))
    // .pipe(catchError((e) => {
    //  if(e.status === 403 || e.status === 401) {
    //    return e;
    //  }
    //   alert('Could not updated jobs in database');
    //   return e;
    // }))
    // .subscribe(() => {
    //   alert('Jobs have been signed off');
    // })
  }

  getRowColor(record) {
    if(record.finalSignoff !== '' && record.finalSignoff !== null) {
      return '#27ae60'
    }
    else {
      return '#f39c12';
    }
   }

   isSighOffButtonVisible(record, button) {

    // If it's transport sign off or charges only don't show sign off button
     return !record.finalSignoff || record.finalSignoff === '';
   }

   openModal(modal:string,record) {
     this.defect = record;
     this.vehicle.id = record.vehicleId;
     this.modalService.open(modal);

   }

}
