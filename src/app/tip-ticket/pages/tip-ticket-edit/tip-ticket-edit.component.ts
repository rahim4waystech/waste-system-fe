import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { TipTicket } from 'src/app/job-signoff-land-services/models/tip-ticket.model';
import { TipTicketService } from 'src/app/job-signoff-land-services/services/tip-ticket.service';
import { TipTicketValidatorService } from '../../validators/tipticket-validator.service';

@Component({
  selector: 'app-tip-ticket-edit',
  templateUrl: './tip-ticket-edit.component.html',
  styleUrls: ['./tip-ticket-edit.component.scss']
})
export class TipTicketEditComponent implements OnInit {

  tipTicket: TipTicket = new TipTicket();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private tipTicketValidatorService: TipTicketValidatorService,
    private tipTicketService: TipTicketService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadTicket(+params['id']);
    })
  }

  loadTicket(id: number): void {
    this.tipTicketService.getTipTicketById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((ticket: TipTicket) => {
      this.tipTicket = ticket;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.tipTicketValidatorService.isValid(this.tipTicket)) {
      // try to save it
      this.tipTicketService.updateTipTicket(this.tipTicket)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        this.isSuccess = true;
      })
    } else {
      this.isError = true;
    }
  }

}
