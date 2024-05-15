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
  selector: 'app-order-section',
  templateUrl: './order-section.component.html',
  styleUrls: ['./order-section.component.scss']
})
export class OrderSectionComponent implements OnInit {

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  @Input()
  account:Account = new Account();


  buttons: GridButton[] = [
    {label: '<i class="fas fa-pencil-alt"></i>', link: '/orders/edit/:id', type: 'btn-warning',} as GridButton,
    {label: '<i class="fas fa-check-circle"></i>', link: '/orders/accept/:id', type: 'btn-success', trigger: (record) => record.orderStatus.name !== 'Accepted'} as GridButton,
    {label: '<i class="fas fa-times-circle"></i>', link: '/orders/decline/:id', type: 'btn-danger',trigger: (record) => record.orderStatus.name !== 'Accepted'} as GridButton,
    {label: '<i class="fas fa-copy"></i>', link: '/orders/copy/:id', type: 'btn-info'} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Account', field: 'account.name'} as GridColumn,
    {active: true, label: 'Site', field: 'site.name', value: (v, r) => !r.site ? 'N/A' : r.site} as GridColumn,
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
  filters: GridFilter[] = []

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
      field: 'account.parentId', // quote is held on site basis
    } as GridFilter)

    // Dynamically add filters
    this.gridComponent.filters = plFilters;

    // Refresh grid
    this.gridComponent.getRecordsForEntity();
  }


  newOrder(){
    this.router.navigateByUrl('/order/new/account/' + this.account.id);
  }

}
