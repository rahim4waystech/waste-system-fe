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
  selector: 'app-quote-section',
  templateUrl: './quote-section.component.html',
  styleUrls: ['./quote-section.component.scss']
})
export class QuoteSectionComponent implements OnInit {

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  @Input()
  account:Account = new Account();

  buttons: GridButton[] = [
    {label: '<i class="fas fa-pencil-alt"></i>', link: '/quoting/edit/:id', type: 'btn-warning',} as GridButton,
    {label: '<i class="fas fa-check-circle"></i>', link: '/quoting/accept/:id', type: 'btn-success', trigger: (record) => record.quoteStatus.name !== 'Accepted'} as GridButton,
    {label: '<i class="fas fa-times-circle"></i>', link: '/quoting/decline/:id', type: 'btn-danger',trigger: (record) => record.quoteStatus.name !== 'Accepted'} as GridButton,
    // {label: '<i class="fas fa-copy"></i>', link: '/quoting/copy/:id', type: 'btn-info'} as GridButton,
  ]


  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Site', field: 'account.name', value: (v,r) => r.account ? r.account.name : 'N/A' } as GridColumn,
    {active: true, label: 'Quote Number', field: 'quoteNumber'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []

  searchFields: any = ['name','quoteNumber','description','account.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'name',
      label: 'Name',
    } as GridSearchFilter,
    {
      field: 'quoteNumber',
      label: 'Quote Number',
    } as GridSearchFilter,
    {
      field: 'description',
      label: 'Description',
    } as GridSearchFilter,
    {
      field: 'account.name',
      label: 'Site Name',
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
      field: 'account.parentId', // quote is held on site basis
    } as GridFilter)

    // Dynamically add filters
    this.gridComponent.filters = plFilters;

    // Refresh grid
    this.gridComponent.getRecordsForEntity();
  }


  newQuote(){
    this.router.navigateByUrl('/quote/new/account/' + this.account.id);
  }

}
