import { Component, OnInit } from '@angular/core';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  buttons: GridButton[] = [
    {label: 'Add Opportunity', link: '/opportunities/new/:id', type: 'btn-success',} as GridButton,
    {label: 'Edit', link: '/leads/edit/:id', type: 'btn-warning',} as GridButton,
   ]
   columns: GridColumn[] = [
     {active: true, label: '#', field: 'id'} as GridColumn,
     {active: true, label: 'Subject', field: 'subject'} as GridColumn,
     {active: true, label: 'Est. Revenue', field: 'estimatedRevenue'} as GridColumn,
     {active: true, label: 'Account', field: 'account.name',value:(v,r)=>{return this.checkAccount(v,r)}} as GridColumn,
     {active: true, label: 'Type', field: 'type.name'} as GridColumn,
     {active: true, label: 'Status', field: 'status.name'} as GridColumn,
     {active: true, label: 'Contact', field: 'contact.firstName', value: (v, r) => { if(r.contactId !== -1 && r.contactId !== null) { return r.contact.firstName + ' ' + r.contact.lastName } else { return 'No Contact Set' }}} as GridColumn,
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

  constructor(
  ) { }

  ngOnInit(): void {
  }

  checkAccount(v,r){
    if(r.accountId === -1 || r.accountId === null){
      return 'No Account Set';
    } else {
      return r.account.name;
    }
  }

}
