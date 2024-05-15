import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-lead-section',
  templateUrl: './lead-section.component.html',
  styleUrls: ['./lead-section.component.scss']
})
export class LeadSectionComponent implements OnInit, AfterViewInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  @Input()
  account:Account = new Account();

  leadButtons: GridButton[] = [
    {label: 'Add Opportunity', link: '/opportunities/account/:id', type: 'btn-success',} as GridButton,
    {label: 'Edit', link: '/leads/edit/:id', type: 'btn-warning',} as GridButton,
   ]
   leadColumns: GridColumn[] = [
     {active: true, label: '#', field: 'id'} as GridColumn,
     {active: true, label: 'Subject', field: 'subject'} as GridColumn,
     {active: true, label: 'Est. Revenue', field: 'estimatedRevenue'} as GridColumn,
     {active: true, label: 'Type', field: 'type.name'} as GridColumn,
     {active: true, label: 'Status', field: 'status.name'} as GridColumn,
     {active: true, label: 'Contact', field: 'contact.firstName', value: (v, r) => { if(r.contactId !== -1 && r.contactId !== null) { return r.contact.firstName + ' ' + r.contact.lastName } else { return 'No Contact Set' }}} as GridColumn,
     {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
     {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
   ];

   // Org filter handled at API level
   leadFilters: GridFilter[] = [{}as GridFilter]
   leadSearchFields: any = ['subject', 'estimatedRevenue', 'account.name', 'type.name', 'status.name', 'contact.firstName'];

   leadSearchFilters: GridSearchFilter[] = [
     {
       field: 'subject',
       label: 'Subject',
     } as GridSearchFilter,
     {
       field: 'estimatedRevenue',
       label: 'Est. Revenue',
     } as GridSearchFilter,
     {
       field: 'account.name',
       label: 'Account',
     } as GridSearchFilter,
     {
       field: 'type.name',
       label: 'Type',
     } as GridSearchFilter,
     {
       field: 'status.name',
       label: 'Status',
     } as GridSearchFilter,
     {
       field: 'contact.firstName',
       label: 'Contact',
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
        const leadFilters = [];
        leadFilters.push({
          condition: 'eq',
          value: this.account.id,
          field: 'accountId'
        } as GridFilter)

        // Dynamically add filters
        this.gridComponent.filters = leadFilters;

        // Refresh grid
        this.gridComponent.getRecordsForEntity();
      }
    }
  }

  checkAccount(v,r){
    if(r.accountId === -1 || r.accountId === null){
      return 'No Account Set';
    } else {
      return r.account.name;
    }
  }

  ngAfterViewInit(){
    const leadFilters = [];
    leadFilters.push({
      condition: 'eq',
      value: this.account.id,
      field: 'accountId'
    } as GridFilter)

    // Dynamically add filters
    this.gridComponent.filters = leadFilters;

    // Refresh grid
    this.gridComponent.getRecordsForEntity();
  }

  newLead(){
    this.router.navigateByUrl('/leads/new/' + this.account.id);
  }

}
