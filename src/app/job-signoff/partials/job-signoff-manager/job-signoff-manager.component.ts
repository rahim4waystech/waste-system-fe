import { Component, OnInit, ViewChild } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Order } from 'src/app/order/models/order.model';
import { TippingPrice } from 'src/app/account/models/tipping-price.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { catchError, take } from 'rxjs/operators';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { InvoiceItem } from 'src/app/invoice/models/invoice-item.model';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';

@Component({
  selector: 'app-job-signoff-manager',
  templateUrl: './job-signoff-manager.component.html',
  styleUrls: ['./job-signoff-manager.component.scss']
})
export class JobSignoffManagerComponent implements OnInit {

  invoiceItems: InvoiceItem[] = [];
  searchFilters: any = {};
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  
  constructor(private jobService: JobService, private invoiceService: InvoiceService) { }

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
  buttons: GridButton[] = [
    {label: 'Edit job', link: '/job-signoff/manager/:id', type: 'btn-warning'} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    // {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Date', field: 'date'} as GridColumn,
    // {active: true, label: 'Time', field: 'order.time'} as GridColumn,
    {active: true, label: 'Account', field: 'order.account.name'} as GridColumn,
    {active: true, label: 'Site', field: 'order.site.name', value: (v,r) => this.getAddressForOrder(r.order)} as GridColumn,
    {active: true, label: 'Container Type', field: 'order.containerType.name'} as GridColumn,
    {active: true, label: 'Container Size', field: 'order.containerSizeType.size', value: (v,r) => r.order.containerSizeType.size + ' Yard' } as GridColumn,
    {active: true, label: 'Grade', field: 'order.grade.name', value: (v,r) => !r.order.grade.name ? 'N/A' : r.order.grade.name} as GridColumn,
    {active: true, label: 'Driver', field: 'jobAssignment.driver.firstName', value: (v, r) => { if(r.jobAssignment.driverId !== -1) { return r.jobAssignment.driver.firstName + ' ' + r.jobAssignment.driver.lastName } else { return 'Subcontractor' } }} as GridColumn,
    {active: true, label: 'Vehicle', field: 'jobAssignment.vehicle.registration', value: (v, r) => { if(r.jobAssignment.vehicleId !== -1) { return r.jobAssignment.vehicle.registration } else { return 'Subcontractor' }  }} as GridColumn,
    {active: true, label: 'Subcontractor', field: 'jobAssignment.subcontractor.name', value: (v, r) => { if(r.jobAssignment.subcontractorId !== -1) { return r.jobAssignment.subcontractor.name } else { return 'N/A' } }} as GridColumn,
    // {active: true, label: 'Transport Status', field: 'jobSignOffStatusId', value: (v, r) => this.getStatusName(v)} as GridColumn,
    {active: true, label: 'Manager Status', field: 'jobManagerSignOff', value: (v, r) => v ? 'Signed off' : 'Not Signed off'} as GridColumn,
    {active: true, label: 'Tonnage (Weight)', field: 'weight', value: (v, r) => this.getWeightValue(r)} as GridColumn,
    {active: true, label: 'Tipping fee (£)', field: 'tippingPriceId', value: (v, r) => this.getTippingPriceValue(r)} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    // {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Show transport signed off jobs for charges only and transport sign off
  filters: GridFilter[] = [
    {
      field: 'jobSignOffStatusId',
      condition: 'in',
      value: [3,4,6]
    } as GridFilter,
    // only Skip jobs
    {
      field: 'order.orderTypeId',
      condition:'eq',
      value: 1,
    } as GridFilter,
  ]

  searchFields: any = ['date','time','order.account.name','order.containerType.name','order.site.name','order.containerSizeType.size','order.grade.name','jobAssignment.driver.firstName','jobAssignment.driver.lastName','jobAssignment.vehicle.registration'];

  searchFiltersGrid: GridSearchFilter[] = [
    {
      field: 'date',
      label: 'Date',
      type: 'date',
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
      field: 'order.containerType.name',
      label: 'Container Type',
    } as GridSearchFilter,
    {
      field: 'order.site.name',
      label: 'Site Name',
    } as GridSearchFilter,
    {
      field: 'order.containerSizeType.size',
      label: 'Container Size',
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

  selectedJobs: Job[] = [];

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

    if(record.tippingPrice) {
      if(record.tippingPrice.price <= 0) {
        return 'pink';
      }
    }

    if(!record.jobManagerSignOff && (record.tippingPriceId === -1 || !record.tippingPriceId)) {
      return 'pink';
    }
    else if(record.jobManagerSignOff) {
      return '#27ae60';
    }
    else {
      return '';
    }
   }

   isSighOffButtonVisible(record, button) {

    // If it's transport sign off or charges only don't show sign off button
     return !record.jobManagerSignOff;
   }

   getStatusName(statusId) {
     return this.statuses[statusId] === undefined ? 'Pending' : this.statuses[statusId];
   }

   getTippingPriceValue(record) {
    if(record.tippingPrice) {
      if(record.tippingPrice.price <= 0) {
        return '<span style="color: red; font-weight:bold;">0.00<span>';
      } else {
        return record.tippingPrice.price.toFixed(2);
      }
    }
    return '<span style="color: red; font-weight:bold;">0.00<span>';

   }

   getWeightValue(record) {
      if(record.weight === 0) {
        return '<span style="color: red; font-weight:bold;">0T<span>';
      } else {
        return (record.weight - record.tareWeight) + 'T';
      }

   }

   onSignOffButtonClicked() {
     if(this.selectedJobs.length === 0) {
       alert("You must select at least one job for signoff");
       return;
     }

     this.selectedJobs.forEach((job: Job) => {
      job.jobManagerSignOff = true;
     });

     const jobs = this.selectedJobs.filter(sj => sj.jobManagerSignOff === false);

     this.jobService.bulkUpdateJob(this.selectedJobs)
     .pipe(take(1))
     .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
       alert('Could not updated jobs in database');
       return e;
     }))
     .subscribe(() => {
       this.assignJobsToInvoice(this.selectedJobs);
     })
   }

   assignJobsToInvoice(jobs: Job[]) {
    this.invoiceService.assignJobsToInvoice(jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot assign jobs to invoice');
      return e;
    }))
    .subscribe((data) => {
      alert('Selected Jobs have been signed off');
    })
   }

   onCheckboxSelected($event) {
    if($event.checked) {
      this.selectedJobs.push($event.record);
    } else {
      this.selectedJobs = this.selectedJobs.filter(j => j.id !== $event.record.id);
    }
   }

   clearSelected() {
     this.selectedJobs = [];
     this.gridComponent.selectedRecords = [];
   }

   getSelectedDetails() {

    let price = 0;
    let qty = 0;

    this.selectedJobs.forEach((job: any) => {
      qty += job.qty;
      price += job.order.orderLines[0].price * job.qty;
    });

    return {total: this.selectedJobs.length, qty: qty, price:price.toFixed(2)};
  }

  clear() {
    this.searchFilters = {};
    this.search();
  }

  search() {
    //this.setSearchFieldOnGrid('date', '') -dates
    this.setSearchFieldOnGrid('jobAssignment.vehicle.registration', this.searchFilters['vehicle'], 'cont');
    this.setSearchFieldOnGrid('jobAssignment.driver.firstName', this.searchFilters['driver'], 'cont');
    this.setSearchFieldOnGrid('order.account.name', this.searchFilters['customer'], 'cont');
    this.setSearchFieldOnGrid('id', this.searchFilters['jobNumber']);
    this.setSearchFieldOnGrid('order.poNumber', this.searchFilters['orderRef'], 'cont');
    this.setSearchFieldOnGrid('jobAssignment.subcontractor.name', this.searchFilters['subcontractor'], 'cont');

    this.setDateRangeFilter();
    this.setSignOffStatusSearch();

    this.gridComponent.getRecordsForEntity();
    this.gridComponent.onPaginationPageClicked(1);
  }

  setDateRangeFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'date');
    if(this.searchFilters['startDate'] && this.searchFilters['startDate'] !== '' && this.searchFilters['endDate'] && this.searchFilters['endDate'] !== '') {
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

  setSearchFieldOnGrid(fieldName, value, operator='eq') {

    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== fieldName);
    if(value && value !== '') {
      this.gridComponent.filters.push({
        condition: operator,
        value: value,
        field: fieldName,
      })
    }
  }

  setSignOffStatusSearch() {
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'jobManagerSignOff');

  
    if(this.searchFilters.status === 'not' || this.searchFilters.status === 'signed') {
      this.gridComponent.filters.push(
        {
          condition: 'eq',
          field: 'jobManagerSignOff',
          value: <any>(this.searchFilters.status === 'not' ? 0 : 1),
        }  as GridSelectedFilter
    );
  }
}
}
