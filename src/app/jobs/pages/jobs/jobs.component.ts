import { Component, OnInit, ViewChild } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Order } from 'src/app/order/models/order.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { catchError, take } from 'rxjs/operators';
import { ContainerSizeType } from 'src/app/container/models/container-size-type.model';
import { ContainerService } from 'src/app/container/services/container.service';
import { SkipOrderType } from 'src/app/order/models/skip-order-type.model';
import { OrderService } from 'src/app/order/services/order.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  drivers: Driver[] = [];
  containerSizeTypes: ContainerSizeType[] = [];
  skipOrderTypes: SkipOrderType[] = [];
  customFilters: any = {
    startDate: '',
    endDate: '',
    customerName: '',
    siteAddress: '',
    skipOrderTypeId: -1,
    containerSizeTypeId: -1,
    driverId: -1,
  };
  routerLink = '/home';

  constructor(private driverService: DriverService,
    private orderService: OrderService,
    private containerService: ContainerService,
              private router: Router) {
    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load drivers');
      return e;
    }))
    .subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    })

    this.containerService.getAllContainerSizes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load container sizes')
      return e;
    }))
    .subscribe((sizes: ContainerSizeType[]) => {
      this.containerSizeTypes = sizes;
    })

    this.orderService.getAllSkipOrderTypes()
    .pipe(take(1))
    .pipe(catchError((e) =>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load skip order types')
      return e;
    }))
    .subscribe((data: any) => {
      this.skipOrderTypes = data;
    })
   }

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

  mainStatuses: string[] = [
    'N/A',
    'Pending',
    'Approved',
    'Deleted',
    'Signed off',
    'Invoiced'
  ];

  buttons: GridButton[] = [
    {label: 'Edit', link: '/jobs/edit/:id', type: 'btn-warning'} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Date', field: 'date'} as GridColumn,
    {active: true, label: 'Time', field: 'order.time'} as GridColumn,
    {active: true, label: 'Account', field: 'order.account.name'} as GridColumn,
    {active: true, label: 'Site', field: 'order.site.name', value: (v,r) => this.getAddressForOrder(r.order)} as GridColumn,
    {active: true, label: 'Container Type', field: 'order.containerType.name'} as GridColumn,
    {active: true, label: 'Container Size', field: 'order.containerSizeType.size', value: (v,r) => r.order.containerSizeType.size + ' Yard' } as GridColumn,
    {active: true, label: 'Grade', field: 'order.grade.name'} as GridColumn,
    {active: true, label: 'Driver', field: 'jobAssignment.driver.firstName', value: (v, r) => { if(r.jobAssignment.driverId !== -1) { return r.jobAssignment.driver.firstName + ' ' + r.jobAssignment.driver.lastName } else { return 'Subcontractor' } }} as GridColumn,
    {active: true, label: 'Vehicle', field: 'jobAssignment.vehicle.registration', value: (v, r) => { if(r.jobAssignment.vehicleId !== -1) { return r.jobAssignment.vehicle.registration } else { return 'Subcontractor' }  }} as GridColumn,
    {active: true, label: 'Subcontractor', field: 'jobAssignment.subcontractor.name', value: (v, r) => { if(r.jobAssignment.subcontractorId !== -1) { return r.jobAssignment.subcontractor.name } else { return 'N/A' } }} as GridColumn,
    {active: true, label: 'Status', field: 'jobStatusId', value: (v, r) => this.getMainStatusName(v)} as GridColumn,
    {active: true, label: 'Signoff Status', field: 'jobSignOffStatusId', value: (v, r) => this.getStatusName(v)} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    // {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Show approved and signed off jobs.
  // Hide deleted and pending.
  filters: GridFilter[] = [

    // only Skip jobs
    {
      field: 'order.orderTypeId',
      condition:'eq',
      value: 1,
    } as GridFilter,
    {
      field: 'jobStatusId',
      condition:'ne',
      value: 3,
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
    if(record.jobStatusId === 2) {
      return 'rgb(39, 174, 96)'
    }
    else if(record.jobStatusId === 4) {
      return 'rgb(155, 89, 182)';
    }
    else if(record.jobStatusId === 5) {
      return '#2980b9';
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

   getMainStatusName(statusId) {
    return this.mainStatuses[statusId] === undefined ? 'Pending' : this.mainStatuses[statusId];
  }

   search() {

    const filters = [];

    // start date
    if(this.customFilters.startDate !== '') {
      filters.push({
        value: this.customFilters.startDate,
        field: 'date',
        condition: 'gte'
      } as GridSelectedFilter);
    }

    // end date
    if(this.customFilters.endDate !== '') {
      filters.push({
        value: this.customFilters.endDate,
        field: 'date',
        condition: 'lte'
      } as GridSelectedFilter);
    }

    // customer name
    if(this.customFilters.customerName !== '') {
    filters.push({
      value: this.customFilters.customerName,
      field: 'order.account.name',
      condition: 'eq'
    } as GridSelectedFilter);
  }

   //skipOrderTypeId
  if(this.customFilters.skipOrderTypeId !== -1) {
    filters.push({
      value: this.customFilters.skipOrderTypeId,
      field: 'order.skipOrderTypeId',
      condition: 'eq'
    } as GridSelectedFilter);
  }

  if(this.customFilters.containerSizeTypeId !== -1) {
    filters.push({
      value: this.customFilters.containerSizeTypeId,
      field: 'order.containerSizeTypeId',
      condition: 'eq'
    } as GridSelectedFilter);
  }

  if(this.customFilters.driverId !== -1) {
    filters.push({
      value: this.customFilters.driverId,
      field: 'jobAssignment.driverId',
      condition: 'eq'
    } as GridSelectedFilter);
  }


  if(this.customFilters.siteAddress !== '') {
    filters.push({
      value: this.customFilters.siteAddress,
      field: 'order.site.billingAddress1',
      condition: 'cont'
    } as GridSelectedFilter);
  }



    // Dynamically add filters
    this.gridComponent.selectedFilters = filters;

    // Refresh grid
    this.gridComponent.getRecordsForEntity();
   }

}
