import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { BatchService } from 'src/app/batch/services/batch.service';
import { take, catchError } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { ViewChild } from '@angular/core';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { AfterViewInit } from '@angular/core';
import { InvoiceStateService } from '../../services/invoice-state.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, AfterViewInit {

  selectedInvoices: any = {invoices: []};
  currentInvoiceStatus: string ='Open';
  customerEmail: any = {email: ''};

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;
  constructor(private modalService: ModalService,
    private invoiceStateService: InvoiceStateService,
    private batchService: BatchService) { }



  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.setInvoiceStatus('Open');
  }


  buttons: GridButton[] = [
    {label: 'Edit', link: '/invoices/edit/:id', type: 'btn-warning', trigger: (record, button) =>  true/*record.invoiceStatusId === 1*/} as GridButton,
    {label: 'Uninvoice', link: '/invoices/rollback/:id', type: 'btn-danger',} as GridButton,
    {label: 'Add Credit Note', action: (button,record) => { this.invoiceStateService.currentInvoiceChanged$.next(record);    this.customerEmail.email = record.account.email
;this.modalService.open('addCreditNoteModal') }, type: 'btn-secondary'} as GridButton,

  ]
  columns: GridColumn[] = [
    {active: true, label: 'Invoice #', field: 'id', value: (v,r) => environment.invoicing.invoicePrefix + v} as GridColumn,
    {active: true, label: 'Account Name', field: 'account.name'} as GridColumn,
    {active: true, label: 'Billing Address', field: 'account.id', value: (v, r) => this.getAddressDetails(v, r.account)} as GridColumn,
    {active: true, label: 'VAT', field: 'taxType.id', value: (v, r) => r.taxType.name + `(${r.taxType.rate}%)`} as GridColumn,
    {active: true, label: 'Invoice Status', field: 'invoiceStatusId', value: v => v === 1 ? 'Open' : 'Closed'} as GridColumn,
    {active: true, label: 'Invoice Period', field: 'invoicePeriod.name'} as GridColumn,
    {active: true, label: 'Printed', field: 'posted', value: v => v ? 'Yes' : 'No'} as GridColumn,
    {active: true, label: 'Printed Date', field: 'postedDate', value: v => !v ? 'Not printed yet' : moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Emailed', field: 'emailed', value: v => v ? 'Yes' : 'No'} as GridColumn,
    {active: true, label: 'Emailed Date', field: 'emailedDate', value: v => !v ? 'Not emailed yet' : moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    // {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['account.name','invoicePeriod.name','id'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'account.name',
      label: 'Customer',
    } as GridSearchFilter,
    {
      field: 'invoicePeriod.name',
      label: 'Period',
    } as GridSearchFilter,
    {
      field: 'id',
      label: 'Invoice Number',
    } as GridSearchFilter,
    {
      field: 'invoiceStatusId',
      label: 'Invoice Status',
    } as GridSearchFilter,
    {
      label: 'Created At',
      field: 'date',
      type: 'date'
    } as GridSearchFilter
  ]

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

  openModal(modalName: string) {
    this.modalService.open(modalName);
  }

  onCheckedSelected($event) {
    if($event.checked) {
      this.selectedInvoices.invoices.push($event.record);
    } else {
      this.selectedInvoices.invoices = this.selectedInvoices.invoices.filter(j => j.id !== $event.record.id);
    }
  }

  print() {

    if(this.selectedInvoices.invoices.length === 0) {
      alert('Please select at least one invoice to print');
      return;
    }

    this.customerEmail.email = this.selectedInvoices.invoices[0].account.email;

    this.openModal("printInvoiceModal");

  }

  changeCustomer() {

    if(this.selectedInvoices.invoices.length === 0) {
      alert('Please select at least one invoice to change customer');
      return;
    }

    this.openModal("changeCustomerInvoiceModal");

  }

  setInvoiceStatus(status: string) {
    this.currentInvoiceStatus = status;



      if(this.currentInvoiceStatus !== '') {
        this.gridComponent.selectedFilters = [
          {
            condition: 'eq',
            field: 'invoiceStatusId',
            value: <any>(this.currentInvoiceStatus === 'Open' ? 1 : 2),
          }  as GridSelectedFilter
        ]
        this.gridComponent.getRecordsForEntity();
        this.gridComponent.onValueChanged();
      } else {
        this.gridComponent.selectedFilters = [];
        this.gridComponent.getRecordsForEntity();
        this.gridComponent.onValueChanged();
      }
  }

  export() {

    if(this.selectedInvoices.invoices.length === 0) {
      alert('Please select at least one invoice to export');
      return;
    }

    const invoiceIds = [];

    this.selectedInvoices.invoices.forEach((invoice) => {
      invoiceIds.push(invoice.id);
    })


    this.batchService.generateBatchExportFromInvoiceIds(invoiceIds)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not export records.Please try again later');
      return e;
    }))
    .subscribe((data) => {
      var blob = new Blob([<any>data], {type: 'text/csv' })
      saveAs(blob, "batch-"+moment().format('yyyy-MM-DD')+".csv");
    })

  }
  email() {

    if(this.selectedInvoices.invoices.length === 0) {
      alert('Please select at least one invoice to email');
      return;
    }

    this.customerEmail.email = this.selectedInvoices.invoices[0].account.email


    this.openModal("emailInvoiceModal");

  }

}
