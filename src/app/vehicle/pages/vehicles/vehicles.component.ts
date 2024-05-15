import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

import * as moment from 'moment';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/vehicles/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Registration', field: 'registration'} as GridColumn,
    {active: true, label: 'Type', field: 'vehicleType.name'} as GridColumn,
    {active: true, label: 'VIN Number', field: 'vinNumber'} as GridColumn,
    {active: true, label: 'Make', field: 'make'} as GridColumn,
    {active: true, label: 'Model', field: 'model'} as GridColumn,
    {active: true, label: 'Depot', field: 'depot.name', value: (v, r) => !r.depot ? 'N/A' : r.depot.name} as GridColumn,
    {active: true, label: 'Fuel Type', field: 'fuelType.name', value: (v, r) => !r.fuelType ? 'N/A' : r.fuelType.name} as GridColumn,
    {active: true, label: 'Is Active', field: 'active', value: v => v ? '<span class="badge badge-success">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []

  searchFields: any = ['vinNumber','registration','make','model','vehicleType.name','depot.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'vinNumber',
      label: 'VIN Number',
    } as GridSearchFilter,
    {
      field: 'registration',
      label: 'Registration',
    } as GridSearchFilter,
    {
      field: 'make',
      label: 'Make',
    } as GridSearchFilter,
    {
      field: 'model',
      label: 'Model',
    } as GridSearchFilter,
    {
      field: 'vehicleType.name',
      label: 'Vehicle Type',
    } as GridSearchFilter,
    {
      field: 'depot.name',
      label: 'Depot'
    } as GridSearchFilter
  ]

  constructor() { }

  ngOnInit(): void {
  }


}
