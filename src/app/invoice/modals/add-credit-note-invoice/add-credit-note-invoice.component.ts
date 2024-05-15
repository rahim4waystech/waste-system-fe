import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Unit } from 'src/app/order/models/unit.model';
import { OrderService } from 'src/app/order/services/order.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { environment } from 'src/environments/environment';
import { CreditNote } from '../../models/credit-note.model';
import { InvoiceItem } from '../../models/invoice-item.model';
import { Invoice } from '../../models/invoice.model';
import { CreditNoteService } from '../../services/credit-note.service';
import { InvoiceStateService } from '../../services/invoice-state.service';
import { InvoiceService } from '../../services/invoice.service';
import { CreditNoteValidatorService } from '../../validators/credit-note-validator.service';

@Component({
  selector: 'app-add-credit-note-invoice',
  templateUrl: './add-credit-note-invoice.component.html',
  styleUrls: ['./add-credit-note-invoice.component.scss']
})
export class AddCreditNoteInvoiceComponent implements OnInit {

  creditNote: CreditNote = new CreditNote();
  invoice: Invoice = new Invoice();
  items: InvoiceItem[] = [];
  units: Unit[] = [];
  sendEmail:boolean = false;
  message:string = `Hi,
  Please find attached your requested credit note.
  
  Regards,
  The Management team`;
  @Input()
  email: any = {email: ''};


  jobAssignments: JobAssignment[] = [];
  constructor(private modelService: ModalService,
    private invoiceService: InvoiceService,
    private orderService: OrderService,
    private creditNoteService: CreditNoteService,
    private creditNoteValidator: CreditNoteValidatorService,
    private jobAssignmentService: JobAssignmentService,
    private invoiceStateService: InvoiceStateService) { }

  ngOnInit(): void {
    this.invoiceStateService.currentInvoiceChanged$.subscribe((invoice) => {
      this.invoice = invoice;

      // load invoice items
      if(this.invoice) {
        this.loadInvoiceItems();
      }
    });

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load units');
      return e;
    }))
    .subscribe((units: Unit[]) => {
      this.units = units;
    })
  }

  loadInvoiceItems() {
    this.invoiceService.getAllInvoiceItemsByInvoiceIdExpanded(this.invoice.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load items for invoice');
      return e;
    }))
    .subscribe((items: InvoiceItem[]) => {
      this.items = items;

      this.loadAssignments();
    })
  }

  loadAssignments() {
    let ids = this.items.map((i: any) => i.job.jobAssignmentId);
    this.jobAssignmentService.getJobAssignmentsByIds(ids)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load job assignments');
      return e;
    }))
    .subscribe((assignments: any) => {
      this.jobAssignments = assignments;
    })
  }

  getJobAssignmentById(assignmentId: number=-1) {
    let assignment = this.jobAssignments.filter(ja => ja.id === assignmentId)[0];

    if(!assignment || assignment === null) {
      return '';
    } else {
      return assignment; 
    }
  }
 
  getUnitbyId(unitId: number=-1) {
    let unit = this.units.filter(u => u.id === unitId)[0];
 
    if(!unit || unit === null) {
    return '';
    } else {
      return unit; 
    }
  }
 
  save() {
    this.creditNote.invoiceId = this.invoice.id;
    this.creditNote.deleted = false;

    if(this.creditNoteValidator.isValid(this.creditNote)) {
      // add credit note

      this.creditNoteService.createCreditNote(this.creditNote)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('could not create credit note');
        return e;
      }))
      .subscribe((note:CreditNote) => {
      //  TODO: show credit note on screen once added
      this.creditNote.id = note.id;
        this.saveCreditNote();
      })
    }
  }

  cancel() {
    this.creditNote = new CreditNote();
    this.modelService.close('addCreditNoteModal');
  }

  saveCreditNote() {

    if(this.sendEmail) {
      this.creditNote.emailed = true;
      this.creditNote.emailedDate = moment().format('YYYY-MM-DD');
    }

    

    this.creditNoteService.updateCreditNote(this.creditNote)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update credit note. Please try again later');
      return e;
    }))
    .subscribe((data) => {
      this.createCNPDFFile(this.creditNote.id);
    })
  }

  onChargeSelected($event) {
    let id = +$event.target.value;

    let item = this.getInvoiceItemById(id);

    if(item) {
      this.creditNote.invoiceItemId = id;
      this.creditNote.jobId = item.jobId;

      if(this.creditNote.value <= 0) {
      //  this.creditNote.value = <any>(item.qty * item.price).toFixed(2);
      }
    }
  }

  getInvoiceItemById(invoiceItemId: number=-1) {
    if(!invoiceItemId || invoiceItemId === -1) {
      return null;
    } else {
      let item = this.items.filter(i => i.id === invoiceItemId)[0];

      return !item ? null : item;
    }
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
    if(this.sendEmail) {
      this.send();
    }

    else {
      window.location.href = '/invoice'; 
    }
  })
}

send() {
  if(this.email === '' || this.message === '') {
    alert('You must supply a valid email and message');
    return;
  }

  this.creditNoteService.emailCreditNote(this.creditNote.id, this.email.email, this.message)
  .pipe(take(1))
  .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
    alert('Could not email credit note. Please ensure email address is correct.');
    return e;
  }))
  .subscribe(() => {
    window.location.href = '/invoice';    
  })

}
}
