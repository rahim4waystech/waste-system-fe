import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { TipTicket } from 'src/app/job-signoff-land-services/models/tip-ticket.model';
import { TipTicketService } from 'src/app/job-signoff-land-services/services/tip-ticket.service';

@Component({
  selector: 'app-tip-ticket-delete',
  templateUrl: './tip-ticket-delete.component.html',
  styleUrls: ['./tip-ticket-delete.component.scss']
})
export class TipTicketDeleteComponent implements OnInit {

  tipTicket: TipTicket = new TipTicket();
  constructor(private tipTicketService: TipTicketService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadTicket(+params['id']);
    })
  }

  loadTicket(ticketId: number) {
    this.tipTicketService.getTipTicketById(ticketId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load ticket');
      return e;
    }))
    .subscribe((ticket: TipTicket) => {
      this.tipTicket = ticket;
    })
  }


  onCancelClicked() {
    this.tipTicket.deleted = true;

    this.tipTicketService.updateTipTicket(this.tipTicket)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not delete tip ticket');
      return e;
    }))
    .subscribe(() => {
      this.router.navigateByUrl('/tip-ticket');
    })
  }

}
