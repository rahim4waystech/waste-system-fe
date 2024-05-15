import { AfterViewInit, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-artic-add-job',
  templateUrl: './artic-add-job.component.html',
  styleUrls: ['./artic-add-job.component.scss']
})
export class ArticAddJobComponent implements OnInit,AfterViewInit {

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

 
  accounts: Account[] = [];

  sites: Account[] = [];

  buttons: GridButton[] = [
    {label: 'Select', action: this.select.bind(this), type: 'btn-primary',} as GridButton,

  ]
  
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Account', field: 'account.name'} as GridColumn, 
    {active: true, label: 'Site', field: 'site.name'} as GridColumn,
    {active: true, label: 'Tip Site', field: 'tipSite.name', value: (v, r) => !r.tipSite ? 'N/A' : r.tipSite.name} as GridColumn,
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

  searchFields: any = ['id','account.name','site.name','date','time','description','orderStatus.name','poNumber','orderType.name', 'tipSite.name'];

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
    {
      field: 'tipSite.name',
      label: 'Tip Site',
    } as GridSearchFilter,
  ]

  customSearchFilters: any = {};

  relationships: string[] = ['tipSite'];
  
  date = moment().format('YYYY-MM-DD');

  constructor(private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService) { 

   }

   ngAfterViewInit(): void {
    this.route.params.subscribe((params) => {
      this.date = params['date'];
      this.setDateFilter();
      // Refresh grid
      this.gridComponent.getRecordsForEntity();
    });
   }

   setDateFilter() {

    let siteFilter: any = {};
    siteFilter = {
      condition: 'eq',
      value: this.date,
      field: 'date'
    } as GridFilter;
  
    // Dynamically add filters
    this.gridComponent.filters.push(siteFilter);
   }
  ngOnInit(): void {
    this.accountService.getAllAccountsForCustomerAndProspect()
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not load accounts');
      return e;
    }))
    .subscribe((accounts: any) => {
      this.accounts = accounts;
    });

    this.accountService.getAllSites()
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not load sites');
      return e;
    }))
    .subscribe((accounts: any) => {
      this.accounts = accounts;
    });
  }
  
  search() {
    this.gridComponent.newPage = 1;
    this.gridComponent.filters = [];
    this.setDateFilter();

    if(this.customSearchFilters['orderId'] && this.customSearchFilters['orderId'] !== -1) {
      let filter = {
        condition: 'eq',
        value: this.customSearchFilters['orderId'],
        field: 'id'
      } as GridFilter;

      this.gridComponent.filters.push(filter);
    }

    if(this.customSearchFilters['customer'] && this.customSearchFilters['customer'] !== '') {
      let filter = {
        condition: 'eq',
        value: this.customSearchFilters['customer'],
        field: 'account.id'
      } as GridFilter;

      this.gridComponent.filters.push(filter);
    }
 

    if(this.customSearchFilters['site'] && this.customSearchFilters['site'] !== '') {
      let filter = {
        condition: 'cont',
        value: this.customSearchFilters['site'],
        field: 'site.name'
      } as GridFilter;

      this.gridComponent.filters.push(filter);
    }


    console.log(this.gridComponent.filters);
    this.gridComponent.newPage = 1;
    this.gridComponent.getRecordsForEntity();

    
  }

  clear() {
    this.gridComponent.filters = [];
    this.customSearchFilters = {};
    this.setDateFilter();
    // Refresh grid

    this.gridComponent.newPage = 1;
    this.gridComponent.getRecordsForEntity();
  }

  
 
  loadSites(accountId: number=-1) {
    this.accountService.getAllSitesForAccount(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load sites');
      return e;
    }))
    .subscribe((sites: Account[]) => {
      this.sites = sites;
    })
  }
  select(button, record): void {

    alert('/artics/job/new/' + record.id);
      this.router.navigateByUrl('/artics/job/new/' + record.id + '/' + this.date);
  }
}
