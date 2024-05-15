import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Invoice } from 'src/app/invoice/models/invoice.model';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-job-signoff-invoice-generate-preview',
  templateUrl: './job-signoff-invoice-generate-preview.component.html',
  styleUrls: ['./job-signoff-invoice-generate-preview.component.scss']
})
export class JobSignoffInvoiceGeneratePreviewComponent implements OnInit {

  url: any = '';
  isLoaded: boolean = false;
  invoiceIds: number[] = [];
  showPods: any = {showPods: false};

  selectedInvoices: any = {invoices: []};
  customerEmail: any = {email: ''};
  constructor(private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private modalService: ModalService,
    private san: DomSanitizer) { 

      this.url = this.san.bypassSecurityTrustResourceUrl('');
    }



  ngOnInit(): void {
    this.route.params.subscribe((params) => {

      this.invoiceIds = params['ids'].split(',');

      this.showPods.showPods = params['showPods'] === 1 ? true : false;

      this.invoiceService.getAllInvoicesByInvoiceIds(this.invoiceIds)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('could not load invoices by invoice ids');
        return e;
      }))
      .subscribe((invoices: Invoice) => {
        this.selectedInvoices.invoices = invoices;

        this.customerEmail.email = this.selectedInvoices.invoices[0].account.email;
      })

      this.createPDFFile();
    });
  }

  createPDFFile() {
    const data =  {
      "invoiceIds": this.invoiceIds,
      "type": 1,
      "pods": this.showPods.showPods,
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
      this.url = this.san.bypassSecurityTrustResourceUrl(environment.publicUrl.substring(0, environment.publicUrl.length - 1) + data.fileName);
      this.isLoaded = true;
  });
}

openModal(modalName: string='') {
  this.modalService.open(modalName);
}

}

