import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-fuel-advanced',
  templateUrl: './fuel-advanced.component.html',
  styleUrls: ['./fuel-advanced.component.scss']
})
export class FuelAdvancedComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/fuel/edit/:id', type: 'btn-warning',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Date', field: 'date', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Vehicle', field:'vehicle.name'} as GridColumn,
    {active: true, label: 'Mileage', field: 'mileage'} as GridColumn,
    {active: true, label: 'Fuel Used', field: 'fuel'} as GridColumn,
    {active: true, label: 'Notes', field: 'notes', value: (v: string) => v.substr(0, 120) + '...'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []

  searchFields: any = ['date','vehicle.name','mileage','fuel','notes'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'date',
      label: 'Date',
    } as GridSearchFilter,
    {
      field: 'vehicle.name',
      label: 'Vehicle',
    } as GridSearchFilter,
    {
      field: 'mileage',
      label: 'Mileage',
      type: 'number',
    } as GridSearchFilter,
    {
      field: 'fuel',
      label: 'Fuel',
      type: 'number',
    } as GridSearchFilter,
    {
      field: 'notes',
      label: 'Note',
    } as GridSearchFilter,
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
