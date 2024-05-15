import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {


  buttons: GridButton[] = [
    {label: 'Edit', link: '/quoting/products/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Unit', field: 'unit.name'} as GridColumn,
    {active: true, label: 'Price', field: 'price'} as GridColumn,
    {active: true, label: 'Is Active', field: 'active', value: v => v ? '<span class="badge badge-success">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []

  searchFields: any = ['name','price','unit.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'unit.name',
      label: 'Unit',
    } as GridSearchFilter,
    {
      field: 'name',
      label: 'Name',
    } as GridSearchFilter,
    {
      field: 'price',
      label: 'Price',
      type: 'number',
    } as GridSearchFilter,
    {
      field: 'active',
      label: 'Active',
    } as GridSearchFilter,
  ]

  ngOnInit() {

  }

}
