import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { MaterialUpliftTicket } from 'src/app/order/models/material-uplift-ticket.model';
import { MaterialUpliftTicketService } from '../../services/material-uplift-ticket.service';
import { OrderMaterialUpliftTicketValidatorService } from '../../validators/order-material-uplift-ticket-validator.service';

@Component({
  selector: 'app-materal-uplift-add',
  templateUrl: './materal-uplift-add.component.html',
  styleUrls: ['./materal-uplift-add.component.scss']
})
export class MateralUpliftAddComponent implements OnInit {

  materialUpliftTicket: MaterialUpliftTicket = new MaterialUpliftTicket();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private orderMaterialUpliftTicketValidatorService: OrderMaterialUpliftTicketValidatorService,
    private materialUpliftTicketService: MaterialUpliftTicketService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;
    
    this.materialUpliftTicket.job = {id: this.materialUpliftTicket.jobId} as any;

    if(this.orderMaterialUpliftTicketValidatorService.isDataValid(this.materialUpliftTicket)) {
      // try to save it
      this.materialUpliftTicketService.createMaterialUpliftTicket(this.materialUpliftTicket)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/job-signoff/material-uplift';
      })
    } else {
      this.isError = true;
    }
  }

}
