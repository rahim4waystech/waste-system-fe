import { Component, OnInit } from '@angular/core';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';

@Component({
  selector: 'app-driver-defects',
  templateUrl: './driver-defects.component.html',
  styleUrls: ['./driver-defects.component.scss']
})
export class DriverDefectsComponent implements OnInit {
  allDefectsFilters: GridFilter[] = [
    {field:'driverReportStatus', condition:'eq',value:'2'}
  ];

  allDefectsSearchFields: any = [
    {field: 'id',label: 'Defect Id',} as GridSearchFilter,
    {field: 'vehicle.registration',label: 'Registration',} as GridSearchFilter,
    {field: 'decription',label: 'Description',} as GridSearchFilter,
    {field: 'driver.firstName',label: 'Driver First Name',} as GridSearchFilter,
    {field: 'driver.lastName',label: 'Driver Surname',} as GridSearchFilter
  ];

  allDefectsSearchFilters: any = ['id','vehicle.registration','description','driver.firstName','driver.lastName','bookedFor']

  allDefectsButtons: GridButton[] = [
    {label: '<i class="fas fa-eye"></i>', link: '/4workshop/defect/:id', type: 'btn-info',} as GridButton,
    {label: '<i class="fas fa-file-download"></i>', link: '/4workshop/defect/:id', type: 'btn-info',} as GridButton
  ]

  allDefectsColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Reporter', field: 'driverId', value:(v, r) => !r.driver ? 'N/A' : r.driver.firstName + ' ' + r.driver.lastName} as GridColumn
  ];

  acceptedDefectsFilters: GridFilter[] = [
    {field:'driverReportStatus', condition:'eq',value:'1'}
  ];

  acceptedDefectsSearchFields: any = [
    {field: 'id',label: 'Defect Id',} as GridSearchFilter,
    {field: 'vehicle.registration',label: 'Registration',} as GridSearchFilter,
    {field: 'decription',label: 'Description',} as GridSearchFilter,
    {field: 'driver.firstName',label: 'Driver First Name',} as GridSearchFilter,
    {field: 'driver.lastName',label: 'Driver Surname',} as GridSearchFilter
  ];

  acceptedDefectsSearchFilters: any = ['id','vehicle.registration','description','driver.firstName','driver.lastName','bookedFor']

  acceptedDefectsButtons: GridButton[] = [
    {label: '<i class="fas fa-eye"></i>', link: '/4workshop/defect/:id', type: 'btn-info',} as GridButton
  ]

  acceptedDefectsColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Reporter', field: 'driverId', value:(v, r) => !r.driver ? 'N/A' : r.driver.firstName + ' ' + r.driver.lastName} as GridColumn
  ];


  rejectedDefectsFilters: GridFilter[] = [
    {field:'driverReportStatus', condition:'eq',value:'3'}
  ];

  rejectedDefectsSearchFields: any = [
    {field: 'id',label: 'Defect Id',} as GridSearchFilter,
    {field: 'vehicle.registration',label: 'Registration',} as GridSearchFilter,
    {field: 'decription',label: 'Description',} as GridSearchFilter,
    {field: 'driver.firstName',label: 'Driver First Name',} as GridSearchFilter,
    {field: 'driver.lastName',label: 'Driver Surname',} as GridSearchFilter
  ];

  rejectedDefectsSearchFilters: any = ['id','vehicle.registration','description','driver.firstName','driver.lastName','bookedFor']

  rejectedDefectsButtons: GridButton[] = [
    {label: '<i class="fas fa-eye"></i>', link: '/4workshop/defect/:id', type: 'btn-info',} as GridButton,
    {label: '<i class="fas fa-redo"></i>', link: '', type: 'btn-info',} as GridButton
  ]

  rejectedDefectsColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Reporter', field: 'driverId', value:(v, r) => !r.driver ? 'N/A' : r.driver.firstName + ' ' + r.driver.lastName} as GridColumn
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
