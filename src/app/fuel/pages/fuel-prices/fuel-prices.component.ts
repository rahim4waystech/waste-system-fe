import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-fuel-prices',
  templateUrl: './fuel-prices.component.html',
  styleUrls: ['./fuel-prices.component.scss']
})
export class FuelPricesComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/fuel/prices/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Effective Date', field: 'effectiveDate'} as GridColumn,
    {active: true, label: 'Price', field: 'price'} as GridColumn,
    {active: true, label: 'Fuel Type', field: 'fuelType.name'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['price','effectiveDate','fuelType.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'price',
      label: 'Price',
      type: 'number',
    } as GridSearchFilter,
    {
      field: 'effectiveDate',
      label: 'Effective Date',
      type: 'date',
    } as GridSearchFilter,
    {
      field: 'fuelType.name',
      label: 'Fuel Type',
    } as GridSearchFilter,
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
