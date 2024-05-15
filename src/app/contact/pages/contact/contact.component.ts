import { Component, OnInit } from '@angular/core';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  buttons: GridButton[] = [
    {label: 'Edit', link: '/contacts/edit/:id', type: 'btn-warning',} as GridButton,
   ]
   columns: GridColumn[] = [
     {active: true, label: '#', field: 'id'} as GridColumn,
     {active: true, label: 'First Name', field: 'firstName'} as GridColumn,
     {active: true, label: 'Last Name', field: 'lastName'} as GridColumn,
     {active: true, label: 'Job Title', field: 'jobTitle'} as GridColumn,
     {active: true, label: 'Phone Number', field: 'businessPhone'} as GridColumn,
     {active: true, label: 'Email', field: 'email'} as GridColumn,
     {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
     {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
   ];

   // Org filter handled at API level
   filters: GridFilter[] = []
   searchFields: any = ['firstName', 'lastName', 'jobTitle', 'businessPhone', 'email'];

   searchFilters: GridSearchFilter[] = [
     {
       field: 'firstName',
       label: 'First Name',
     } as GridSearchFilter,
     {
       field: 'lastName',
       label: 'Last Name',
     } as GridSearchFilter,
     {
       field: 'jobTitle',
       label: 'Job Title',
     } as GridSearchFilter,
     {
       field: 'businessPhone',
       label: 'Phone Number',
     } as GridSearchFilter,
     {
       field: 'email',
       label: 'email',
     } as GridSearchFilter,
   ]

   constructor(private router: Router) { }

   ngOnInit(): void {
   }

}
