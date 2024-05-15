import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/drivers/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'First Name', field: 'firstName'} as GridColumn,
    {active: true, label: 'Last Name', field: 'lastName'} as GridColumn,
    {active: true, label: 'Employee Number', field: 'employeeNumber'} as GridColumn,
    {active: true, label: 'Depot', field: 'depot.name', value: (v, r) => !r.depot ? 'N/A' : r.depot.name} as GridColumn,
    {active: true, label: 'Type', field: 'driverType.name'} as GridColumn,
    {active: true, label: 'Is Active', field: 'active', value: v => v ? '<span class="badge badge-success">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['firstName','lastName','employeeNumber','driverType.name','depot.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'firstName',
      label: 'First Name',
    } as GridSearchFilter,
    {
      field: 'lastName',
      label: 'Last Name',
    } as GridSearchFilter,
    {
      field: 'employeeNumber',
      label: 'Employee Number',
    } as GridSearchFilter,
    {
      field: 'driverType.name',
      label: 'Driver Type',
    } as GridSearchFilter,
    {
      field: 'depot.name',
      label: 'Depot',
    } as GridSearchFilter,
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
