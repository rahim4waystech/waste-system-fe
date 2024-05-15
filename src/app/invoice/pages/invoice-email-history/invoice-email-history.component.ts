import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { environment } from 'src/environments/environment';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-email-history',
  templateUrl: './invoice-email-history.component.html',
  styleUrls: ['./invoice-email-history.component.scss']
})
export class InvoiceEmailHistoryComponent implements OnInit {

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
  }

  buttons: GridButton[] = [
    {label: 'View Invoice', type: 'btn-warning', action: (button, record) => this.createPDFFile(record.invoiceId)} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: 'Invoice #', field: 'invoiceId', value: v => environment.invoicing.invoicePrefix + v} as GridColumn,
    {active: true, label: 'Customer', field: 'invoice.account.name'} as GridColumn,
    {active: true, label: 'Date', field: 'date', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Sent To', field: 'toEmail'} as GridColumn,
    // {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['invoiceId','toEmail', 'invoice.account.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'invoice.account.name',
      label: 'Customer',
    } as GridSearchFilter,
    {
      field: 'id',
      label: 'InvoiceId',
    } as GridSearchFilter,
    {
      field: 'toEmail',
      label: 'Sent To',
    } as GridSearchFilter,
    {
      label: 'Date',
      field: 'date',
      type: 'date'
    } as GridSearchFilter
  ]

  createPDFFile(invoiceId) {
    const invoiceIds = [];

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

}
