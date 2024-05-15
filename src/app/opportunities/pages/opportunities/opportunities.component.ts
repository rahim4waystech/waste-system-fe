import { Component, OnInit } from '@angular/core';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { OpportunityService } from '../../services/opportunity.service';
import { AccountService } from 'src/app/account/services/account.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent implements OnInit {
  buttons: GridButton[] = [
    {label: 'Edit', link: '/opportunities/edit/:id', type: 'btn-warning',} as GridButton,
  ]
  columns: GridColumn[] = [
     {active: true, label: '#', field: 'id'} as GridColumn,
     {active: true, label: 'Opportunity', field: 'opportunityName'} as GridColumn,
     {active: true, label: 'Lead', field: 'lead.subject', value: (v, r) => !r.lead ? 'N/A' : r.lead.subject} as GridColumn,
     {active: true, label: 'Account', field: 'account.name', value: (v, r) => !r.account ? 'N/A' : r.account.name} as GridColumn,
     {active: true, label: 'Status', field: 'status.name'} as GridColumn,
     {active: true, label: 'Est. Close Date', field: 'estimatedCloseDate', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
     {active: true, label: 'Actual Close Date', field: 'actualClosedDate'} as GridColumn,
     {active: true, label: 'Actual Revenue', field: 'actualRevenue', value: v => '£' + v} as GridColumn,
     {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
     {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

   // Org filter handled at API level
   filters: GridFilter[] = []
   searchFields: any = ['subject', 'estimatedRevenue', 'account.name', 'type.name', 'status.name', 'contact.firstName'];

   searchFilters: GridSearchFilter[] = [
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

   accounts:any = [];

  constructor(
    private opportunityService: OpportunityService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }
}
