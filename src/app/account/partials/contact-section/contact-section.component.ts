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
  selector: 'app-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss']
})
export class ContactSectionComponent implements OnInit, AfterViewInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  @Input()
  account:Account = new Account();

  contactButtons: GridButton[] = [
    {label: 'Edit', link: '/contacts/edit/:id', type: 'btn-warning',} as GridButton,
   ]
   contactColumns: GridColumn[] = [
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
   // contactFilters: GridFilter[] = []
   contactFilters: GridFilter[] = [{}as GridFilter]
   contactSearchFields: any = ['firstName', 'lastName', 'jobTitle', 'businessPhone', 'email'];

   contactSearchFilters: GridSearchFilter[] = [
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

   constructor(
     private router:Router
   ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    // Set sites account id
    if(changes.account) {
      if(changes.account.currentValue.id !== -1) {
        const contactFilters = [];
        contactFilters.push({
          condition: 'eq',
          value: this.account.id,
          field: 'accounts.id'
        } as GridFilter)

        // Dynamically add filters
        this.gridComponent.filters = contactFilters;

        // Refresh grid
        this.gridComponent.getRecordsForEntity();
      }
    }
  }

  ngAfterViewInit(){
    const contactFilters = [];
    contactFilters.push({
      condition: 'eq',
      value: this.account.id,
      field: 'accounts.id'
    } as GridFilter)

    // Dynamically add filters
    this.gridComponent.filters = contactFilters;

    // Refresh grid
    this.gridComponent.getRecordsForEntity();
  }


    newContact(){
      this.router.navigateByUrl('/contacts/new/' + this.account.id);
    }
}
