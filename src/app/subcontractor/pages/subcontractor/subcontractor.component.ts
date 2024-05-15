import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-subcontractor',
  templateUrl: './subcontractor.component.html',
  styleUrls: ['./subcontractor.component.scss']
})
export class SubcontractorComponent implements OnInit {
  buttons: GridButton[] = [
    {label: 'Edit', link: '/subcontractors/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Notes', field: 'notes'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [
    {
      field: 'subcontractorTypeId',
      condition: 'eq',
      value: 1,
    } as GridFilter
  ]

  searchFields: any = ['name','notes'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'name',
      label: 'name',
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
