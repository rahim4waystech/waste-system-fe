import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-view-pdf',
  templateUrl: './invoice-view-pdf.component.html',
  styleUrls: ['./invoice-view-pdf.component.scss']
})
export class InvoiceViewPdfComponent implements OnInit {

  constructor(private invoiceService: InvoiceService,
    private route: ActivatedRoute) { } 

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.createPDFFile(+params['id']);
    })
  }



  createPDFFile(invoiceId: number) {
    const invoiceIds = [];

    invoiceIds.push(invoiceId);

    const data =  {
      "invoiceIds": invoiceIds,
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
      window.close();
    })
  }
}
