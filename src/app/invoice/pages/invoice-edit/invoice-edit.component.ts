import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { TaxType } from '../../models/tax-type.model';
import { InvoiceItem } from '../../models/invoice-item.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { environment } from 'src/environments/environment';
import { CreditNoteService } from '../../services/credit-note.service';
import { CreditNote } from '../../models/credit-note.model';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit {

  @Input()
  invoice: Invoice = new Invoice();

  invoicingPrefix = '';

  taxTypes: TaxType[] = [];
  items: InvoiceItem[] = [];
  creditNotes: CreditNote[] = [];

  isError: boolean = false;
  isSuccess: boolean = false;
  constructor(private invoiceService: InvoiceService,
    private modalService: ModalService,
    private creditNoteService: CreditNoteService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadInvoice(+params['id']);
    });


    this.invoiceService.getAllTaxTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Could not get all tax types");
      return e;
    }))
    .subscribe((types: TaxType[]) => {
      this.taxTypes = types;
    })

    this.getPrefix();
  }

  getPrefix(){
    return environment.invoicing.invoicePrefix;
  }


  loadCreditNotes() {
    this.creditNoteService.getCreditNotesByInvoiceId(this.invoice.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      return e;
    }))  
    .subscribe((notes: CreditNote[]) => {
      this.creditNotes = notes;
    })
  }

  loadInvoice(invoiceId: number) {
    this.invoiceService.getInvoiceById(invoiceId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load invoice for editing');
      return e;
    }))
    .subscribe((invoice: Invoice) => {
      this.invoice = invoice;
      this.loadItems(invoice.id);
      this.loadCreditNotes();
    })
  }

  loadItems(invoiceId: number) {
    this.invoiceService.getAllInvoiceItemsByInvoiceId(invoiceId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load items for invoice')
      return e;
    }))
    .subscribe((items: InvoiceItem[]) => {
      this.items = items;

      if(!this.invoice.loadEx || this.invoice.loadEx === '') {
        this.invoice.loadEx = this.items[0].description;
      }
    })
  }

  onDeleteClickedForItem(index) {
    const invoiceItem = this.items[index];

    if(invoiceItem.id === -1) {
      this.items.splice(index, 1);
    } else {
      this.invoiceService.deleteInvoiceItemById(invoiceItem.id)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert("Could not delete invoice item");
        return e;
      }))
      .subscribe(() => {
        this.items.splice(index, 1);
      })
    }

  }

  save() {
    this.isError = false;
    this.isSuccess = false;

    this.invoiceService.updateInvoice(this.invoice)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update invoice. Please try again later.')
      return e;
    }))
    .subscribe((invoice: Invoice) => {
      this.invoice = invoice;
      this.createBulkInvoiceItems();
    })
  }

  createBulkInvoiceItems() {
    this.items.forEach((item) => {
      item.invoiceId = this.invoice.id;
    });

    this.invoiceService.createBulkInvoiceItems(this.items)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Cannot update invoice items. Please try again later.");
      return e;
    }))
    .subscribe((items: InvoiceItem[]) => {
      this.items = items;
      this.isSuccess = true;
    })

  }

  openModal(modalName: string) {
    this.modalService.open(modalName);
  }

  createCNPDFFile(creditNoteId:number=-1) {

    const data =  {
    }

    this.creditNoteService.createPDF(creditNoteId, data)
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
  
  getCreditNoteForInvoiceItem(invoiceItemId: number=-1) {
    if(invoiceItemId === -1 || !invoiceItemId) {
      throw new Error('you must provide a id in getCreditNoteForInvoiceItem');
    }

    let note = this.creditNotes.filter(cn => cn.invoiceItemId === invoiceItemId)[0];

    if(!note) {
      return null;
    }

    return note;
  }

}
