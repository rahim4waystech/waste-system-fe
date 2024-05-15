import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-rollback',
  templateUrl: './invoice-rollback.component.html',
  styleUrls: ['./invoice-rollback.component.scss']
})
export class InvoiceRollbackComponent implements OnInit {

  invoice: Invoice = new Invoice();
  constructor(private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.loadInvoice(id);
    });
  }

  loadInvoice(id: number) {
    this.invoiceService.getInvoiceById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load invoice');
      return e;
    }))
    .subscribe((invoice: Invoice) => {
      this.invoice = invoice;
    });
  }

  onCancelClicked()  {
    this.invoiceService.rollback(this.invoice.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not rollback invoice');
      return e;
    }))
    .subscribe(() => {
      this.redirect();
    })
  }

  redirect() {
    window.location.assign("/invoices");
  }

}
