import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-fitter-absence',
  templateUrl: './fitter-absence.component.html',
  styleUrls: ['./fitter-absence.component.scss']
})
export class FitterAbsenceComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/4workshop/fitters/absence/edit/:id', type: 'btn-warning',} as GridButton,
    {label: 'Cancel Absence', link: '/4workshop/fitters/absence/cancel/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'First Name', field: 'fitter.firstName',} as GridColumn,
    {active: true, label: 'Last Name', field: 'fitter.lastName'} as GridColumn,
    {active: true, label: 'Start Date', field: 'startDate', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'End Date', field: 'endDate', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Notes', field: 'notes', value: (v: string) => v.substr(0, 120) + '...'} as GridColumn,
    {active: true, label: 'Type', field: 'fitterAbsenceType.name'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['fitter.firstName','fitter.lastName','fitterAbsenceType.name','startDate','endDate'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'fitter.firstName',
      label: 'First Name',
    } as GridSearchFilter,
    {
      field: 'fitter.lastName',
      label: 'Last Name',
    } as GridSearchFilter,
    {
      field: 'fitterAbsenceType.name',
      label: 'Absence Type',
    } as GridSearchFilter,
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
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
