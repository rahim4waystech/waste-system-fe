import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { TipTicket } from 'src/app/job-signoff-land-services/models/tip-ticket.model';
import { TipTicketService } from 'src/app/job-signoff-land-services/services/tip-ticket.service';
import { TipTicketValidatorService } from '../../validators/tipticket-validator.service';

@Component({
  selector: 'app-tip-ticket-new',
  templateUrl: './tip-ticket-new.component.html',
  styleUrls: ['./tip-ticket-new.component.scss']
})
export class TipTicketNewComponent implements OnInit {

  tipTicket: TipTicket = new TipTicket();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private tipTicketValidatorService: TipTicketValidatorService,
    private tipTicketService: TipTicketService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.tipTicketValidatorService.isValid(this.tipTicket)) {
      // try to save it
      this.tipTicketService.createTipTicket(this.tipTicket)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/tip-ticket';
      })
    } else {
      this.isError = true;
    }
  }

}
