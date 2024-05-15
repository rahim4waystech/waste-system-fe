import { Component, OnInit, ViewChild } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Order } from 'src/app/order/models/order.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';

@Component({
  selector: 'app-job-signoff-transport',
  templateUrl: './job-signoff-transport.component.html',
  styleUrls: ['./job-signoff-transport.component.scss']
})
export class JobSignoffTransportComponent implements OnInit {

  searchFilters: any = {};
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  
  constructor() { }

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
    {label: 'Sign off', link: '/job-signoff/view/:id', type: 'btn-primary'} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Date', field: 'date'} as GridColumn,
    {active: true, label: 'Time', field: 'order.time'} as GridColumn,
    {active: true, label: 'Account', field: 'order.account.name'} as GridColumn,
    {active: true, label: 'Site', field: 'order.site.name', value: (v,r) => this.getAddressForOrder(r.order)} as GridColumn,
    {active: true, label: 'Container Type', field: 'order.containerType.name'} as GridColumn,
    {active: true, label: 'Container Size', field: 'order.containerSizeType.size', value: (v,r) => r.order.containerSizeType.size + ' Yard' } as GridColumn,
    {active: true, label: 'Grade', field: 'order.grade.name', value: (v,r) => !r.order.grade.name ? 'N/A' : r.order.grade.name} as GridColumn,
    {active: true, label: 'Driver', field: 'jobAssignment.driver.firstName', value: (v, r) => { if(r.jobAssignment.driverId !== -1) { return r.jobAssignment.driver.firstName + ' ' + r.jobAssignment.driver.lastName } else { return 'Subcontractor' } }} as GridColumn,
    {active: true, label: 'Vehicle', field: 'jobAssignment.vehicle.registration', value: (v, r) => { if(r.jobAssignment.vehicleId !== -1) { return r.jobAssignment.vehicle.registration } else { return 'Subcontractor' }  }} as GridColumn,
    {active: true, label: 'Subcontractor', field: 'jobAssignment.subcontractor.name', value: (v, r) => { if(r.jobAssignment.subcontractorId !== -1) { return r.jobAssignment.subcontractor.name } else { return 'N/A' } }} as GridColumn,
    {active: true, label: 'Status', field: 'jobSignOffStatusId', value: (v, r) => this.getStatusName(v)} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    // {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Show approved and signed off jobs.
  // Hide deleted and pending.
  filters: GridFilter[] = [
    {
      field: 'jobStatusId',
      condition: 'in',
      value: [2,4,5],
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
    this.setSignOffFiltersSearch();

    localStorage.setItem('MJL_LAND_SIGNOFF_TRANSPORT_SEARCH', JSON.stringify(this.searchFilters));

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

  setSignOffFiltersSearch() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'jobStatusId' && f.field !== 'jobSignOffStatusId');

    if(this.searchFilters.status === '' || !this.searchFilters.status) {
      this.gridComponent.filters.push(
            {
      field: 'jobStatusId',
      condition: 'in',
      value: [2,4,5]
    } as GridFilter,

      )
    } else if(this.searchFilters.status === 'signed'){

      this.gridComponent.filters.push(
        {
          condition: 'in',
          field: 'jobSignOffStatusId',
          value: <any>([4]),
        }  as GridFilter,
      )
    } else {
      // off
      this.gridComponent.filters.push(
        {
          field: 'jobStatusId',
          condition: 'in',
          value: [2,4,5]
        } as GridFilter
      );

      this.gridComponent.filters.push(
        {
          field: 'jobSignOffStatusId',
          condition: 'notin',
          value: [4,3],
        } as GridFilter,
      )
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

}
