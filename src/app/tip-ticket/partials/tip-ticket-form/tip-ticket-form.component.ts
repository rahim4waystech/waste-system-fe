import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { TipTicket } from 'src/app/job-signoff-land-services/models/tip-ticket.model';
import { Unit } from 'src/app/order/models/unit.model';
import { OrderService } from 'src/app/order/services/order.service';

@Component({
  selector: 'app-tip-ticket-form',
  templateUrl: './tip-ticket-form.component.html',
  styleUrls: ['./tip-ticket-form.component.scss']
})
export class TipTicketFormComponent implements OnInit {

  units: Unit[] = [];

  @Input()
  tipTicket: TipTicket = new TipTicket();
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits() {
    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load units');
      return e;
    }))
    .subscribe((units: any) => {
      this.units = units;
    })
    
  }
}
