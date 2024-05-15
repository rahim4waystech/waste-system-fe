import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {



  buttons: GridButton[] = [
    {label: 'Edit', link: '/container/edit/:id', type: 'btn-warning',} as GridButton,

  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Container Group', field: 'containerGroup.name',} as GridColumn,
    {active: true, label: 'Container Type', field: 'containerType.name'} as GridColumn,
    {active: true, label: 'Container Size', field: 'containerSizeType.name', value: this.getContainer.bind(this)} as GridColumn,
    // {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Location', field: 'containerLocation.name', value: this.getLocation.bind(this)} as GridColumn,
    {active: true, label: 'Serial Number', field: 'serialNumber'} as GridColumn,
    {active: true, label: 'Is Active', field: 'active', value: v => v ? '<span class="badge badge-success">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['name','serialNumber','containerGroup.name','containerType.name','notes'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'name',
      label: 'Name',
    } as GridSearchFilter,
    {
      field: 'serialNumber',
      label: 'Serial Number',
    } as GridSearchFilter,
    {
      field: 'containerGroup.name',
      label: 'Container Group',
    } as GridSearchFilter,
    {
      field: 'containerType.name',
      label: 'Container Type',
    } as GridSearchFilter,
    {
      field: 'notes',
      label: 'Notes',
    } as GridSearchFilter,
  ]

  constructor() { }

  ngOnInit(): void {
  }

  getContainer(value,record){
    if(record.containerSizeTypeId === undefined || record.containerSizeTypeId === null || record.containerSizeTypeId === -1){
      return 'n/a';
    } else {
      return record.containerSizeType.size + ' ' + record.containerSizeType.unit.name;
    }
  }

  getLocation(value,record){
    if(record.containerLocationId === undefined || record.containerLocationId === null || record.containerLocationId === -1){
      return 'In Stock';
    } else {
      return record.containerLocation.name;
    }
  }
}
