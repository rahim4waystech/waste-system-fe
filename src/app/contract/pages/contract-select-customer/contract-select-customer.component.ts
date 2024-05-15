import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-select-customer',
  templateUrl: './contract-select-customer.component.html',
  styleUrls: ['./contract-select-customer.component.scss']
})
export class ContractSelectCustomerComponent implements OnInit {
  buttons: GridButton[] = [
    {label: 'Select', type: 'btn-primary', action: this.select.bind(this)} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
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
  filters: GridFilter[] = [
    {
       field: 'parentId',
       condition: 'eq',
       value: -1,
    },
    // Only customers
    {
      field: 'type_id',
      condition: 'eq',
      value: 3,
    },
    {
      field: 'isactive',
      condition: 'eq',
      value: true,
   },
  ]

  searchFields: any = ['name','accountRef','type.name','contact','phoneNumber'];

  searchFilters: GridSearchFilter[] = [
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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  select(button, record): void {
    if(!record.accountRef || record.accountRef.trim() === '') {
      alert('You cannot select an account without a reference.');
      return;
    } else {
      this.router.navigateByUrl('/contracts/new/customers/' + record.id);
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

}
