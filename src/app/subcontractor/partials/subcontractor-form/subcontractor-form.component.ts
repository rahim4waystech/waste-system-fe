import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Subcontractor } from '../../models/subcontractor.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Router } from '@angular/router';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';

@Component({
  selector: 'app-subcontractor-form',
  templateUrl: './subcontractor-form.component.html',
  styleUrls: ['./subcontractor-form.component.scss']
})
export class SubcontractorFormComponent implements OnInit, OnChanges {

  @Input()
  subcontractor: Subcontractor = new Subcontractor();

  buttons: GridButton[] = [
    {label: 'Edit', link: '/subcontractors/depot/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Notes', field: 'notes'} as GridColumn,
    {active: true, label: 'Type', field: 'SubcontractorTypeId', value: v => 'Depot'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [
    {
      condition: 'eq',
      field: 'subcontractorTypeId',
      value: 2,
    }
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

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){

    // wait for sub id for depots
    if(changes.subcontractor) {

      if(changes.subcontractor.currentValue.id !== -1) {
        this.gridComponent.filters = [];
        this.gridComponent.filters.push({
          condition: 'eq',
          value: this.subcontractor.id,
          field: 'parentId'
        } as GridFilter)

        this.gridComponent.getRecordsForEntity();
      }
    }
  }


  foundContactAddress(event){
    this.subcontractor.contactAddressLine1 = event.address1;
    this.subcontractor.contactAddressLine2 = event.address2;
    this.subcontractor.contactAddressLine3 = event.address3;
    this.subcontractor.contactCity = event.city;
    this.subcontractor.contactCountry = event.country;
  }

  createNewDepot() {
    this.router.navigateByUrl('/subcontractors/depot/new/' + this.subcontractor.id);
  }

}
