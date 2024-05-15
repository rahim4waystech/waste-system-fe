import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Order } from 'src/app/order/models/order.model';
import { take, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-signoff-artic-transport',
  templateUrl: './job-signoff-artic-transport.component.html',
  styleUrls: ['./job-signoff-artic-transport.component.scss']
})
export class JobSignoffArticTransportComponent implements OnInit {

  selectedJobs: Job[] = [];
  constructor(private jobService: JobService, private router: Router) { }

  ngOnInit(): void {
  }

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
    'Sweeper',
    'Shredder',

  ]
  buttons: GridButton[] = [
    {label: 'Sign off', link: '/job-signoff/artic/view/:id', type: 'btn-primary', trigger: this.isSighOffButtonVisible} as GridButton,
    // {label: 'Get destruction certificate', action: (button, record) => {this.onPDFDownload(record);}, type: 'btn-danger'} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,

    {active: true, label: 'Date', field: 'date'} as GridColumn,
    {active: true, label: 'Time', field: 'order.time'} as GridColumn,
    {active: true, label: 'Po Number', field: 'order.poNumber'} as GridColumn,
    {active: true, label: 'Total Price', field: 'qty', value: (v,r) => { return this.getTotalPrice(r) }} as GridColumn,
    {active: true, label: 'Order Unique reference', field: 'order.uniqueReference'} as GridColumn,
    {active: true, label: 'Account', field: 'order.account.name'} as GridColumn,
    {active: true, label: 'Site', field: 'order.site.name', value: (v,r) => this.getAddressForOrder(r.order)} as GridColumn,
    // {active: true, label: 'Grade', field: 'order.grade.name'} as GridColumn,
    {active: true, label: 'Qty', field: 'qty'} as GridColumn,
    {active: true, label: 'Order Type', field: 'order.orderTypeId', value: (v,r) => this.getOrdeTypeName(r.order.orderTypeId)} as GridColumn,
    {active: true, label: 'Driver', field: 'jobAssignment.driver.firstName', value: (v, r) => { if(r.jobAssignment.driverId !== -1) { return r.jobAssignment.driver.firstName + ' ' + r.jobAssignment.driver.lastName } else { return 'Subcontractor' } }} as GridColumn,
    {active: true, label: 'Vehicle', field: 'jobAssignment.vehicle.registration', value: (v, r) => { if(r.jobAssignment.vehicleId !== -1) { return r.jobAssignment.vehicle.registration } else { return 'Subcontractor' }  }} as GridColumn,
    {active: true, label: 'Subcontractor', field: 'jobAssignment.subcontractor.name', value: (v, r) => { if(r.jobAssignment.subcontractorId !== -1) { return r.jobAssignment.subcontractor.name } else { return 'N/A' } }} as GridColumn,
    {active: true, label: 'Status', field: 'jobSignOffStatusId', value: (v, r) => this.getStatusName(v)} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Show approved and signed off jobs.
  // Hide deleted and pending.
  filters: GridFilter[] = [
    {
      field: 'jobStatusId',
      condition: 'in',
      value: [2,4,5]
    } as GridFilter,

    // only land jobs
    {
      field: 'order.orderTypeId',
      condition: 'eq',
      value: 4
    } as GridFilter,
  ]

  searchFields: any = ['date','time','order.account.name','order.containerType.name','order.site.name','order.containerSizeType.size','order.grade.name','jobAssignment.driver.firstName','jobAssignment.driver.lastName','jobAssignment.vehicle.registration'];

  searchFilters: GridSearchFilter[] = [
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
  ]

  getAddressForOrder(order: Order): string {
    let address: string  = '';

    if(order.site.name.trim() !== "") {
     address += ',' + order.site.name;
   }

     if(order.site.shippingAddress1.trim() !== "") {
       address += ',' + order.site.shippingAddress1;
     }

     if(order.site.shippingAddress2.trim() !== "") {
       address += ',' + order.site.shippingAddress2;
     }

     if(order.site.shippingCity.trim() !== "") {
       address += ',' + order.site.shippingCity;
     }

     if(order.site.shippingCountry.trim() !== "") {
       address += ',' + order.site.shippingCountry;
     }

     if(order.site.shippingPostCode.trim() !== "") {
       address += ',' + order.site.shippingPostCode;
     }

     return address.substring(1);
   }

   getRowColor(record) {
    if(record.jobSignOffStatusId === 5 || record.jobSignOffStatusId === 6) {
      return 'pink'
    }
    else if(record.jobSignOffStatusId === 4 || record.jobSignOffStatusId === 3) {
      return '#27ae60';
    }
    else {
      return '';
    }
   }

   isSighOffButtonVisible(record, button) {

    // If it's transport sign off or charges only don't show sign off button
     return [3,4].indexOf(record.jobSignOffStatusId) === -1;
   }

   getStatusName(statusId) {
     return this.statuses[statusId] === undefined ? 'Pending' : this.statuses[statusId];
   }


   getOrdeTypeName(orderTypeId) {
    return this.orderType[orderTypeId - 1] === undefined ? 'N/A' : this.orderType[orderTypeId - 1];
  }

  onPDFDownload(record) {

     this.jobService.generateShreddingPDF({ job: record})
     .pipe(take(1))
     .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
       alert('Could not generate waste transfer note')
       return e;
     }))
     .subscribe((data: any) => {
       window.open(environment.publicUrl + data.fileName, '_blank');
     })

  }
  
  getTotalPrice(record) {
    let total = 0;
    record.order.orderLines.forEach((orderLine: OrderLine) => {
      total += orderLine.qty * orderLine.price;
    });
    
    return '&pound;' + total;
  }
  
  onCheckboxSelected($event) {
    if($event.checked) {
      this.selectedJobs.push($event.record);
    } else {
      this.selectedJobs = this.selectedJobs.filter(j => j.id !== $event.record.id);
    }
   }

   onSignOffClicked() {
    if(this.selectedJobs.length === 0) {
      alert("You must select at least one job for signoff");
      return;
    }

    
     localStorage.setItem('WS_MJL_ARTIC_SIGNOFF_LIST', JSON.stringify(this.selectedJobs));


     this.router.navigateByUrl('/job-signoff/artic/view/' + this.selectedJobs[0].id);
   }


}
