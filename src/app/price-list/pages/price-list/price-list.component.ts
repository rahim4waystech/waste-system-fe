import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/price-list/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Account', field: 'account.name'} as GridColumn,
    {active: true, label: 'Is Active', field: 'active', value: v => v ? '<span class="badge badge-success">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['name','account.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'name',
      label: 'Name',
    } as GridSearchFilter,
    {
      field: 'active',
      label: 'Is Active',
    } as GridSearchFilter,
    {
      field: 'account.name',
      label: 'Account Name',
    } as GridSearchFilter
  ]

  constructor() { }

  ngOnInit(): void {
  }


}
