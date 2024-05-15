import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { Account } from 'src/app/order/models/account.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { AccountValidatorService } from 'src/app/account/validators/account-validator.service';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';

@Component({
  selector: 'app-lead-account-modal',
  templateUrl: './lead-account-modal.component.html',
  styleUrls: ['./lead-account-modal.component.scss']
})
export class LeadAccountModalComponent implements OnInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

    @Output()
    selectedAccounts: EventEmitter<Account> = new EventEmitter();

    newAccount: boolean = false;

    accounts: Account[] = [];
    account: Account = new Account();

    isError:boolean = false;
    isServerError: boolean = false;


    buttons: GridButton[] = [
      // {label: 'Select', type: 'btn-primary', action:this.select.bind(this)} as GridButton,
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
        condition: 'in',
        value: [16,3,8],
      },
      {
        field: 'isactive',
        condition: 'eq',
        value: true,
     },
   ];
   // filters: GridFilter[] = [];

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


    constructor(
      private modalService: ModalService,
      private accountValidatorService: AccountValidatorService,
      private accountService: AccountService
    ) { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges){
      this.gridComponent.getRecordsForEntity();
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

    cancel() {
      this.modalService.close('leadAccountModal');
      this.accounts = [];
      this.gridComponent.getRecordsForEntity();
    }

    save(){
      this.account.type_id = 3;
      this.account.type.id = 3;
        if(this.accountValidatorService.isValid(this.account)) {
          this.accountService.createAccount(this.account)
          .pipe(take(1))
          .pipe(catchError((e) => {
            this.isServerError = true;
            return e;
          }))
          .subscribe((account: Account) => {
            this.selectedAccounts.emit(JSON.parse(JSON.stringify(account)));
            this.cancel();
          })
        } else {
          alert('Please fill in Marked details')
        }
    }

    onCheckedSelected($event) {
      this.selectedAccounts.emit(JSON.parse(JSON.stringify($event)));
      this.cancel();
    }

    foundBillingAddress(event){
      this.account.billingAddress1 = event.address1;
      this.account.billingAddress2 = event.address2;
      this.account.billingCity = event.city;
      this.account.billingCountry = event.country;
    }

    openNewAccount(){
      this.newAccount = true;
    }

    clearNewAccount(){
      this.newAccount = false;
      this.account = new Account();
    }

  }
