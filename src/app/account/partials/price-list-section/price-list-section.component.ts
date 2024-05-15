import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-price-list-section',
  templateUrl: './price-list-section.component.html',
  styleUrls: ['./price-list-section.component.scss']
})
export class PriceListSectionComponent implements OnInit {

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  @Input()
  account:Account = new Account();

  plButtons: GridButton[] = [
    {label: 'Edit', link: '/price-list/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  plColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Account', field: 'account.name'} as GridColumn,
    {active: true, label: 'Is Active', field: 'active', value: v => v ? '<span class="badge badge-success">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  plFilters: GridFilter[] = []
  plSearchFields: any = ['name','account.name'];

  plSearchFilters: GridSearchFilter[] = [
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

  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    // Set sites account id
    if(changes.account) {
      if(changes.account.currentValue.id !== -1) {
        const plFilters = [];
        plFilters.push({
          condition: 'eq',
          value: this.account.id,
          field: 'accountId'
        } as GridFilter)

        // Dynamically add filters
        this.gridComponent.filters = plFilters;

        // Refresh grid
        this.gridComponent.getRecordsForEntity();
      }
    }
  }

  getAccount(r){
    if(r.lead !== undefined){
      this.account.name;
    } else {
      return 'Not Found'
    }
  }

  ngAfterViewInit(){
    const plFilters = [];
    plFilters.push({
      condition: 'eq',
      value: this.account.id,
      field: 'accountId'
    } as GridFilter)

    // Dynamically add filters
    this.gridComponent.filters = plFilters;

    // Refresh grid
    this.gridComponent.getRecordsForEntity();
  }


  newPriceList(){
    this.router.navigateByUrl('/price-list/new/account/' + this.account.id);
  }

}
