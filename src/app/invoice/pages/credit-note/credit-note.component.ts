import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { environment } from 'src/environments/environment';
import { CreditNote } from '../../models/credit-note.model';
import { CreditNoteService } from '../../services/credit-note.service';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {

  currentCreditNote: any = new CreditNote();
  customerEmail: any = {email: ''};

  buttons: GridButton[] = [
   {label: 'View Credit Note', action: (button, record) => this.createCNPDFFile(record.id) , type: 'btn-primary',} as GridButton,
   {label: 'Email Credit Note', action: (button, record) => { this.currentCreditNote = record;     this.customerEmail.email = this.currentCreditNote.invoice.account.email; this.modalService.open('emailCreditNoteModal') }, type: 'btn-info',} as GridButton,
   {label: 'View Invoice', action: (button, record) => this.createPDFFile(record.invoiceId) , type: 'btn-secondary',} as GridButton,

  ]
  columns: GridColumn[] = [
    {active: true, label: 'Credit Note Number', field: 'id', value: (v, r) => 'CN-' + v} as GridColumn,
    {active: true, label: 'Customer', field: 'invoice.account.name'} as GridColumn,
    {active: true, label: 'Invoice Number', field: 'invoiceId', value: (v, r) => environment.invoicing.invoicePrefix + v} as GridColumn,
    {active: true, label: 'Date', field: 'date', value: (v, r) => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Value', field: 'value', value: (v, r) => v * -1} as GridColumn,
    {active: true, label: 'Emailed', field: 'emailed', value: v => v ? 'Yes' : 'No'} as GridColumn,
    {active: true, label: 'Emailed Date', field: 'emailedDate', value: v => !v ? 'Not emailed yet' : moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['id','invoiceId','date','description','value', "invoice.account.name"];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'id',
      label: 'Credit Note Number',
    } as GridSearchFilter,
    {
      field: 'date',
      label: 'Date',
    } as GridSearchFilter,
    {
      field: 'description',
      label: 'Description',
    } as GridSearchFilter,
    {
      field: 'value',
      label: 'Value',
    } as GridSearchFilter,
  ]


  constructor(private creditNoteService: CreditNoteService,
    private modalService: ModalService,
    private invoiceService: InvoiceService) { }

  ngOnInit(): void {
  }

  createPDFFile(invoiceId) {
    const data =  {
      "invoiceIds": [invoiceId],
      "type": 1,
      "pods": false,
      "tipchecks": false,
    }

    this.invoiceService.createPDFBatchFile(data)
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not generate invoice please try again later.');
      return e;
    }))
    .subscribe((data:any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
      // refresh the page so grid is up to date
      //window.location.reload();
    })
  }

  createCNPDFFile(creditNoteId:number=-1) {
    this.creditNoteService.createPDF(creditNoteId, {})
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not generate credit note please try again later.');
      return e;
    }))
    .subscribe((data:any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
      // refresh the page so grid is up to date
      //window.location.reload();
    })
  }
}
