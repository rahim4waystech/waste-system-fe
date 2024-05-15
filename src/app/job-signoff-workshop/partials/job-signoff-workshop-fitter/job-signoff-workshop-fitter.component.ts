import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { Order } from 'src/app/order/models/order.model';
import { environment } from 'src/environments/environment';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { DefectJob } from 'src/app/timeline-workshop/models/defect-job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { DefectService } from 'src/app/workshop/services/defect.service';
import { DefectJobService } from 'src/app/timeline-workshop/services/defect-job.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-job-signoff-workshop-fitter',
  templateUrl: './job-signoff-workshop-fitter.component.html',
  styleUrls: ['./job-signoff-workshop-fitter.component.scss']
})
export class JobSignoffWorkshopFitterComponent implements OnInit {

  buttons: GridButton[] = [
    // {label: 'Get destruction certificate', action: (button, record) => {this.onPDFDownload(record);}, type: 'btn-danger'} as GridButton,
  ]
  selectedJobs: DefectJob[] = [];
  columns: GridColumn[] = [
    // {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Started', field: 'started'} as GridColumn,
    {active: true, label: 'Ended', field: 'ended'} as GridColumn,
    {active: true, label: 'Fitter', field: 'defectAssignment.fitter.firstName', value: (v,r) => r.defectAssignment.fitter.firstName + ' ' + r.defectAssignment.fitter.lastName} as GridColumn,
    {active: true, label: 'Check Area', field: 'defect.vehicleCheckArea.name'} as GridColumn,
    {active: true, label: 'PO Number', field: 'defect.poNumber'} as GridColumn,
    {active: true, label: 'Booked For',field: 'bookedFor', value: v => !v ? 'N/A' : moment(v).format('DD/MM/YYYY')},
    {active: true, label: 'Vehicle', field: 'defect.vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'defect.description'} as GridColumn,
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

  constructor(private jobService: JobService,
    private modalService: ModalService,
    private defectJobService: DefectJobService) {

  }

  ngOnInit() {

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

    this.modalService.open('jobSignOffWorkshopFitterModal');
  }

  getRowColor(record) {
    if(record.defectStatusId === 6) {
      return '#27ae60'
    }
    else {
      return '#f39c12';
    }
   }

   isSighOffButtonVisible(record, button) {

    // If it's transport sign off or charges only don't show sign off button
     return !record.ended || record.ended !== '';
   }

}
