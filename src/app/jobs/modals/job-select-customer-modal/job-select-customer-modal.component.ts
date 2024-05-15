import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { Account } from 'src/app/order/models/account.model';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-job-select-customer-modal',
  templateUrl: './job-select-customer-modal.component.html',
  styleUrls: ['./job-select-customer-modal.component.scss']
})
export class JobSelectCustomerModalComponent implements OnInit {

  @Input()
  job: Job = new Job();

  isError:boolean = false;
  isServerError: boolean = false;

  showSites: boolean = false;
  account: Account = new Account();

  @ViewChildren(GridComponent) grids: QueryList<GridComponent>;



  buttons: GridButton[] = [
    {label: 'Select', type: 'btn-primary', action:this.select.bind(this)} as GridButton,
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
      value: [16,3],
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

  buttonsSite: GridButton[] = [
    {label: 'Select', type: 'btn-primary', action: this.selectSite.bind(this)} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columnsSite: GridColumn[] = [
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
  filtersSite: GridFilter[] = [
  ]
  searchFieldsSite: any = ['name','accountRef','type.name','contact','phoneNumber'];

  searchFiltersSite: GridSearchFilter[] = [
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

  constructor(private modalService: ModalService) { }

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

  selectSite(button,record) {
    this.job.order.account = JSON.parse(JSON.stringify(this.account));
    this.job.order.site = JSON.parse(JSON.stringify(record));
    this.showSites = false;
    this.modalService.close('jobEditSelectCustomerModal');

  }

  select(button, record): void {
    if(!record.accountRef || record.accountRef.trim() === '') {
      alert('You cannot select an account without a reference.');
      return;
    } else {
      this.showSites = true;
      this.account = record;

      // The sites grid add account id
     const grid: GridComponent = this.grids.last;
     grid.selectedFilters.push({
       condition: 'eq',
       field: 'parentId',
       value: this.account.id.toString()
     } as GridSelectedFilter)
     grid.getRecordsForEntity();
    }
  }

  cancel() {
    this.modalService.close('jobEditSelectCustomerModal');
  }

}
