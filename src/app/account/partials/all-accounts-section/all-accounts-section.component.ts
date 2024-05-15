import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { take, catchError } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { PublicFormToken } from 'src/app/public-forms/public-form-token.model';
import { PublicFormsService } from 'src/app/public-forms/services/public-forms.service';
import { AccountService } from '../../services/account.service';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-all-accounts-section',
  templateUrl: './all-accounts-section.component.html',
  styleUrls: ['./all-accounts-section.component.scss']
})
export class AllAccountsSectionComponent implements OnInit {

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  buttons: GridButton[] = [
    {label: 'Edit', link: '/accounts/edit/:id', type: 'btn-sm btn-warning',} as GridButton,
    {label: 'Put on stop', trigger: (record, button) => record.type_id === 3 && record.onStop === false, type: 'btn-sm btn-danger', action: (button, record) => this.changeAccountStoppage(record, true)} as GridButton,
    {label: 'Take off stop', trigger: (record, button) => record.type_id === 3 && record.onStop === true, type: 'btn-sm btn-success', action: (button, record) => this.changeAccountStoppage(record, false)} as GridButton,
 
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    // {active: true, label: 'Logo', field: 'logo', value: v => !v || v === '' ? '<img src="https://returntofreedom.org/store/wp-content/uploads/default-placeholder.png" style="width:3rem;">' : '<img src="' + v+'" style="width: 5rem;">'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Account Ref', field: 'accountRef', value: v => !v || v === '' ? '<span style="color:red;font-weight:bold;">NO ACCOUNT REF</span>' : v} as GridColumn,
    {active: true, label: 'On Stop', field: 'onStop', value: v => v || v === '' ? '<span style="color:red;font-weight:bold;">ACCOUNT ON STOP</span>' : 'N/A'} as GridColumn,
    {active: true, label: 'Type', field: 'type.name', value: (value, record) => record.type === null ? 'N/A': record.type.name  } as GridColumn,
    {active: true, label: 'Contact', field: 'contact'} as GridColumn,
    {active: true, label: 'Contact Number', field: 'phoneNumber'} as GridColumn,
    {active: true, label: 'Address', field: 'billingAddressLine1', value: this.getAddressDetails.bind(this)} as GridColumn,
    {active: true, label: 'Is Active', field: 'isactive', value: v => v ? '<span class="">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,

  ];

  // Org filter handled at API level
  filters: GridFilter[] = [
    {
      field: 'parentId',
      condition: 'eq',
      value: -1,
   },
   {
     field: 'isactive',
     condition: 'eq',
     value: true
   }
  ]
  searchFields: any = ['name', 'accountRef', 'type.name', 'contact', 'phoneNumber', 'source'];

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
  ];

  selectedProspects = [];


  constructor(private router: Router,
    private accountService: AccountService,
    private publicFormService: PublicFormsService) { }

  ngOnInit(): void {
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

  onGenerateLink($event) {
    const token = this.uuidv4();

    const tokenObj = new PublicFormToken();
    tokenObj.token = token;

    this.publicFormService.createToken(tokenObj)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not create token');
      return e;
    }))
    .subscribe((token) => {
      prompt("Please copy the following link and send to the customer to sign up.", "http://localhost:4200/public/new/customer/" + tokenObj.token);
    })

  }

  changeAccountStoppage(account: Account, onStop: boolean) {
    account.onStop = onStop;
    this.accountService.updateAccount(account)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not put account on stop. Please try again later');
      return e;
    }))
    .subscribe((account) => {})
  }

  getColorFromType(record) {
    const typeId = record.type_id;
    switch(typeId) {
      case 3: //customer
        return '#16a085'
      case 8: // prospect
        return '#8e44ad';
      case 15: // tip
        return '#2980b9';
      case 14: // depot
        return '#2c3e50';

       default:
        return '#7f8c8d';
    }
  }

  uuidv4() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
     return v.toString(16);
   });
  }

}
