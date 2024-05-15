import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-find-invoice-by-ticket',
  templateUrl: './report-find-invoice-by-ticket.component.html',
  styleUrls: ['./report-find-invoice-by-ticket.component.scss']
})
export class ReportFindInvoiceByTicketComponent implements OnInit {

  searchFilters: any = {};

  results: any = [];
  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
  }

  loadReport() {
    this.invoiceService.findInvoiceByTicketNoReport(this.searchFilters.ticketNumber)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load report');
      return e;
    }))
    .subscribe((data: any) => {
      this.results = [];

      // reduce down the result set by expanding the ticket numbers and looking complete match
      data.forEach((record) => {
        if(this.checkTickets(record)) {
          this.results.push(record);
        }
       })

    })
  }

  checkTickets(record: Job) {
    const tickets: string[] = record.transportSignOffNotes.split('/');

    let tipTickets = [];
    if(tickets.length > 0) {
      let mainTicket:string = tickets[0];


      tickets.forEach((ticket: string, index) => {
        let formattedTicketNo: string = ticket;

        if(ticket.length > 3) {
          // It's a large set of numbers so must be a new seq
          mainTicket = ticket;
        }

        // tidy this up and make it context based.
        if(ticket.length === 3) {
          formattedTicketNo = mainTicket.substring(0, mainTicket.length - 3) + ticket;
        }

        if(ticket.length === 2) {
          formattedTicketNo = mainTicket.substring(0, mainTicket.length - 2) + ticket;
        }

        if(!tipTickets[index]) {
          tipTickets.push({
            collectionTicketNumber: formattedTicketNo,
            jobId: -1,
            qty: 1,
            unitId: -1, // use tip unit
            price: -0,
          } as any)
        } else {
          tipTickets[index].collectionTicketNumber = <any>formattedTicketNo;
        }
      })

      // clear up any enpty tickets
      tipTickets.filter(tt => tt.collectionTicketNumber.toString().trim() !== '' && tt.collectionTicketNumber !== <any>mainTicket.substring(0, mainTicket.length - 3));
      tipTickets.filter(tt => tt.collectionTicketNumber.toString().trim() !== '' && tt.collectionTicketNumber !== <any>mainTicket.substring(0, mainTicket.length - 2));
    }


    let isTicketMatch = tipTickets.filter(tt => tt.collectionTicketNumber === this.searchFilters['ticketNumber']).length > 0;

    return isTicketMatch;
  }

  exportToCSV() {

  }

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
