import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Account } from 'src/app/order/models/account.model';


@Component({
  selector: 'app-sites-section',
  templateUrl: './sites-section.component.html',
  styleUrls: ['./sites-section.component.scss']
})
export class SitesSectionComponent implements OnInit, AfterViewInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  @Input()
  account:Account = new Account();

  siteButtons: GridButton[] = [
    {label: 'Edit', link: '/accounts/edit/:id', type: 'btn-warning',} as GridButton,
   ]
   siteColumns: GridColumn[] = [
     {active: true, label: '#', field: 'id'} as GridColumn,
     {active: true, label: 'Name', field: 'name'} as GridColumn,
     {active: true, label: 'Account Ref', field: 'accountRef', value: v => !v || v === '' ? '<span style="color:red;font-weight:bold;">NO ACCOUNT REF</span>' : v} as GridColumn,
     {active: true, label: 'Type', field: 'type.name', value: (value, record) => record.type === null ? 'N/A': record.type.name  } as GridColumn,
     {active: true, label: 'Contact', field: 'contact'} as GridColumn,
     {active: true, label: 'Contact Number', field: 'phoneNumber'} as GridColumn,
     {active: true, label: 'Address', field: 'billingAddressLine1', value: this.getAddressDetails.bind(this)} as GridColumn,
     {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
     {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
   ];

   // Org filter handled at API level
   siteFilters: GridFilter[] = [ {
   } as GridFilter

   ]
   siteSearchFields: any = ['name','accountRef','type.name','contact','phoneNumber'];

   siteSearchFilters: GridSearchFilter[] = [
     {
       field: 'name',
       label: 'Name',
     } as GridSearchFilter,
     {
       field: 'accountRef',
       label: 'Account Ref',
     } as GridSearchFilter,
     {
       field: 'type.name',
       label: 'Type',
     } as GridSearchFilter,
     {
       field: 'contact',
       label: 'Contact',
     } as GridSearchFilter,
     {
       field: 'phoneNumber',
       label: 'Contact Number',
     } as GridSearchFilter,
   ]

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    // Set sites account id
    if(changes.account) {
      if(changes.account.currentValue.id !== -1) {
        const siteFilters = [];
        siteFilters.push({
          condition: 'eq',
          value: this.account.id,
          field: 'parentId'
        } as GridFilter)

        // Dynamically add filters
        this.gridComponent.filters = siteFilters;

        // Refresh grid
        this.gridComponent.getRecordsForEntity();
      }
    }
  }

  getAddressDetails(value, record): string {
    let address = '';

    if(record.billingAddress1.trim() !== '') {
      address += record.billingAddress1 + '<br />';
    }

    if(record.billingAddress2.trim() !== '') {
      address += record.billingAddress2 + '<br />';
    }

    if(record.billingCity.trim() !== '') {
      address += record.billingCity + '<br />';
    }

    if(record.billingCountry.trim() !== '') {
      address += record.billingCountry + '<br />';
    }

    if(record.billingPostCode.trim() !== '') {
      address += record.billingPostCode;
    }

    return address;
  }

  ngAfterViewInit(){
    if(this.account.id !== -1) {
    const siteFilters = [];
    siteFilters.push({
      condition: 'eq',
      value: this.account.id,
      field: 'parentId'
    } as GridFilter)

    // Dynamically add filters
    this.gridComponent.filters = siteFilters;

    // Refresh grid
    this.gridComponent.getRecordsForEntity();
  }
  }

}
