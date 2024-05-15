import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-vehicles-vor',
  templateUrl: './vehicles-vor.component.html',
  styleUrls: ['./vehicles-vor.component.scss']
})
export class VehiclesVorComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/vehicles/vor/edit/:id', type: 'btn-warning',} as GridButton,
    {label: 'Cancel VOR', link: '/vehicles/vor/delete/:id', type: 'btn-danger'} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Start Date', field: 'startDate', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'End Date', field: 'endDate', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Vehicle', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [
    {
      condition: 'eq',
      field: 'deleted',
      value: 0,
    } as GridFilter
  ]

  searchFields: any = ['startDate','endDate','vehicle.registration'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'startDate',
      label: 'Start Date',
      type: 'date',
    } as GridSearchFilter,
    {
      field: 'endDate',
      label: 'End Date',
      type: 'date',
    } as GridSearchFilter,
    {
      field: 'vehicle.registration',
      label: 'Registration',
    } as GridSearchFilter,
  ]

  constructor() { }

  ngOnInit(): void {
  }
}
