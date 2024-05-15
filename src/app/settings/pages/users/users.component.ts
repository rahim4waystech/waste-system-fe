import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/settings/users/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'First Name', field: 'firstName'} as GridColumn,
    {active: true, label: 'Last Name', field: 'lastName'} as GridColumn,
    {active: true, label: 'Email', field: 'email'} as GridColumn,
    {active: true, label: 'User Group', field: 'userGroup.name'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []

  searchFields: any = ['firstName','lastName','email'];

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
      field: 'email',
      label: 'Email',
    } as GridSearchFilter,
  ]

  constructor() { }

  ngOnInit(): void {
  }
}
