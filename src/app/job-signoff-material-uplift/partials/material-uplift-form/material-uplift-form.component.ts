import { Component, Input, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { MaterialUpliftTicket } from 'src/app/order/models/material-uplift-ticket.model';
import { MaterialUplift } from 'src/app/order/models/material-uplift.model';
import { Unit } from 'src/app/order/models/unit.model';
import { OrderService } from 'src/app/order/services/order.service';

@Component({
  selector: 'app-material-uplift-form',
  templateUrl: './material-uplift-form.component.html',
  styleUrls: ['./material-uplift-form.component.scss']
})
export class MaterialUpliftFormComponent implements OnInit {

  @Input()
  materialUpliftTicket: MaterialUpliftTicket = new MaterialUpliftTicket();
  units: Unit[] = [];
  tips: Account[] = [];
  constructor(private orderService: OrderService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load units');
      return e;
    }))
    .subscribe((units: any) => {
      this.units = units;
    });

    this.accountService.getAllAccounts()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load tips');
      return e;
    }))
    .subscribe((tips: any) => {
      this.tips = tips;
    })
  }

}
