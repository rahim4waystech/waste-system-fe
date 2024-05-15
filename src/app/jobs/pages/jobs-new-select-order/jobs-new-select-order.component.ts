import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs-new-select-order',
  templateUrl: './jobs-new-select-order.component.html',
  styleUrls: ['./jobs-new-select-order.component.scss']
})
export class JobsNewSelectOrderComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Select', type: 'btn-primary', action:this.select.bind(this)} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Account', field: 'account.name'} as GridColumn,
    {active: true, label: 'Site', field: 'site.name'} as GridColumn,
    {active: true, label: 'Date', field: 'date', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Time', field: 'time'} as GridColumn,
    {active: true, label: 'Description', field: 'description', value: (v: string) => v.substr(0, 120) + '...'} as GridColumn,
    {active: true, label: 'Status', field: 'orderStatus.name'} as GridColumn,
    {active: true, label: 'Type', field: 'orderType.name'} as GridColumn,
    // {active: true, label: 'Po Number', field: 'poNumber'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [
  {
    condition: 'eq',
    value: 2,
    field: 'orderStatusId',
  } as GridFilter,
  {
    condition: 'eq',
    value: 0,
    field: 'orderAllocated',
  } as GridFilter,
  {
    condition: 'eq',
    value: 1,
    field: 'orderTypeId',
  } as GridFilter
  ]

  searchFields: any = ['id','account.name','site.name','date','time','description','orderStatus.name','poNumber','orderType.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'id',
      label: 'Order ID',
    } as GridSearchFilter,
    {
      field: 'account.name',
      label: 'Account',
    } as GridSearchFilter,
    {
      field: 'site.name',
      label: 'Site',
    } as GridSearchFilter,
    {
      field: 'date',
      label: 'Date',
      type: 'date',
    } as GridSearchFilter,
    {
      field: 'time',
      label: 'Time',
    } as GridSearchFilter,
    {
      field: 'description',
      label: 'Description',
    } as GridSearchFilter,
    {
      field: 'orderStatus.name',
      label: 'Order Status',
    } as GridSearchFilter,
    {
      field: 'poNumber',
      label: 'Purchase Order Number',
    } as GridSearchFilter,
    {
      field: 'orderType.name',
      label: 'Order Type',
    } as GridSearchFilter,
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  select(button, record) {
    this.router.navigateByUrl('/jobs/new/order/' + record.id);
  }

}
