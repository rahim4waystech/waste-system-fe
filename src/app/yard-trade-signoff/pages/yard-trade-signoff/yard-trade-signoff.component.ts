import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { YardTrade } from 'src/app/weighbridge/models/yard-trade.model';
import { YardTradeService } from 'src/app/weighbridge/services/yard-trade.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-yard-trade-signoff',
  templateUrl: './yard-trade-signoff.component.html',
  styleUrls: ['./yard-trade-signoff.component.scss']
})
export class YardTradeSignoffComponent implements OnInit {

  selectedYardTrade: YardTrade[] = [];
  constructor(private yardTradeService: YardTradeService,
    private jobService: JobService) { }

  ngOnInit(): void {
  }

  buttons: GridButton[] = [
    {label: 'Print Transfer note', action: (button, record) => {this.onPrintTicket(record)}, type: 'btn-primary',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Customer', field: 'customer.name'} as GridColumn,
    {active: true, label: 'Depot', field: 'depot.name'} as GridColumn,
    {active: true, label: 'Vehicle Reg', field: 'vehicleReg'} as GridColumn,
    {active: true, label: 'ticketNumber', field: 'ticketNumber'} as GridColumn,
    {active: true, label: 'PO Number', field: 'poNumber'} as GridColumn,
    {active: true, label: 'Type of Trade', field: 'typeofTrade'} as GridColumn,
    {active: true, label: 'Gross Weight', field: 'grossWeight'} as GridColumn,
    {active: true, label: 'Tare Weight', field: 'tareWeight'} as GridColumn,
    {active: true, label: 'Grade', field: 'grade.name', value: (v, r) => !r.grade ? 'N/A' : r.grade.name} as GridColumn,
    {active: true, label: '#date', field: 'date', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []

  searchFields: any = ['customer.name','depot.name','vehicleReg','ticketNumber','poNumber','typeofTrade', 'grossWeight', 'tareWeight', 'date'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'customer.name',
      label: 'Customer Name',
    } as GridSearchFilter,
    {
      field: 'depot.name',
      label: 'Depot Name',
    } as GridSearchFilter,
    {
      field: 'vehicleReg',
      label: 'Vehicle Reg',
    } as GridSearchFilter,
    {
      field: 'ticketNumber',
      label: 'ticketNumber',
    } as GridSearchFilter,
    {
      field: 'poNumber',
      label: 'Po Number',
    } as GridSearchFilter,
  ]

  onPrintTicket(record: YardTrade) {
    const invoiceInfo = environment.invoicing;


    if(record.typeofTrade === 0) {
     this.yardTradeService.generateTicket({ yardTrade: record, invoiceInfo: invoiceInfo})
     .pipe(take(1))
     .pipe(catchError((e) => {
       if(e.status === 403 || e.status === 401) {
         return e;
       }
       alert('Could not generate ticket')
       return e;
     }))
     .subscribe((data: any) => {
       window.open(environment.publicUrl + data.fileName, '_blank');
     })
    } else {
      this.yardTradeService.generateTicketOut({ yardTrade: record, invoiceInfo: invoiceInfo})
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not generate ticket')
        return e;
      }))
      .subscribe((data: any) => {
        window.open(environment.publicUrl + data.fileName, '_blank');
      })
    }

  }

  onSignOffButtonClicked() {
    if(this.selectedYardTrade.length === 0) {
      alert("You must select at least one job for signoff");
      return;
    }

    this.selectedYardTrade.forEach((yardTrade: YardTrade) => {
     yardTrade.isSignedOff = true;
    });

    const jobs = this.selectedYardTrade.filter(sj => sj.isSignedOff !== true);


    this.jobService.bulkUpdateYardTrade(this.selectedYardTrade)
    .pipe(take(1)) 
    .pipe(catchError((e) => {
     if(e.status === 403 || e.status === 401) {
       return e;
     }
      alert('Could not updated jobs in database');
      return e;
    }))
    .subscribe(() => {
      this.assignJobs(this.selectedYardTrade);
    })
  }

  assignJobs(jobs: YardTrade[]) {
    this.yardTradeService.assignYardTradeToInvoice(jobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not assign yard trade to invoice');
      return e;
    }))
    .subscribe(() => {
      alert('Selected yard trade jobs have been signed off');
    })
  }

  
  onCheckboxSelected($event) {
    if($event.checked) {
      this.selectedYardTrade.push($event.record);
    } else {
      this.selectedYardTrade = this.selectedYardTrade.filter(j => j.id !== $event.record.id);
    }
   }

   getRowColor(record) {
    if(record.isSignedOff) {
      return '#27ae60';
    }
    else {
      return '';
    }
   }

}
