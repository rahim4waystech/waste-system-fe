import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-fitter-hours-advanced',
  templateUrl: './fitter-hours-advanced.component.html',
  styleUrls: ['./fitter-hours-advanced.component.scss']
})
export class FitterHoursAdvancedComponent implements OnInit {

  buttons: GridButton[] = [
    {label: 'Edit', link: '/4workshop/fitters/hours/edit/:id', type: 'btn-warning',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Date', field: 'date', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Start Time', field:'startTime'} as GridColumn,
    {active: true, label: 'End Time', field: 'endTime'} as GridColumn,
    {active: true, label: 'Lunch Break', field: 'lunchBreak'} as GridColumn,
    {active: true, label: 'Charagble Hours', field: 'chargeableHours'} as GridColumn,
    {active: true, label: 'Notes', field: 'notes', value: (v: string) => v.substr(0, 120) + '...'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['startTime','date','endTime','lunchBreak','chargeableHours','notes'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'startTime',
      label: 'Start Time',
      type: 'time',
    } as GridSearchFilter,
    {
      field: 'date',
      label: 'Date',
      type: 'date',
    } as GridSearchFilter,
    {
      field: 'endTime',
      label: 'End Time',
      type: 'time',
    } as GridSearchFilter,
    {
      field: 'lunchBreak',
      label: 'Lunch Break',
      type: 'number',
    } as GridSearchFilter,
    {
      field: 'chargeableHours',
      label: 'Chargeable Hours',
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
