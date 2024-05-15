import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { CreditNote } from '../../models/credit-note.model';
import { InvoiceStatus } from '../../models/invoice-status.model';
import { Invoice } from '../../models/invoice.model';
import { CreditNoteService } from '../../services/credit-note.service';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-email-credit-note-modal',
  templateUrl: './email-credit-note-modal.component.html',
  styleUrls: ['./email-credit-note-modal.component.scss']
})
export class EmailCreditNoteModalComponent implements OnInit {
  @Input()
  creditNote: CreditNote = new CreditNote();
  message: string = `Hi,
Please see attached your requested credit note

Thanks,
Accounts department`;

  @Input()
  email: any = {email:''};
  
  constructor(private modalService: ModalService,
    private accountService: AccountService,
    private creditNoteService: CreditNoteService,
    private invoiceService: InvoiceService) { }

  ngOnInit(): void {
   
  }

  cancel() {
    this.modalService.close('emailCreditNoteModal');
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
      this.saveCreditNote();
    })

  }

  saveCreditNote() {

    this.creditNote.emailed = true;
    this.creditNote.emailedDate = moment().format('YYYY-MM-DD');

  

    this.creditNoteService.emailCreditNote(this.creditNote.id, this.email.email, this.message)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update credit note. Please try again later');
      return e;
    }))
    .subscribe((data) => {
        window.location.reload();
    })
  }

}
