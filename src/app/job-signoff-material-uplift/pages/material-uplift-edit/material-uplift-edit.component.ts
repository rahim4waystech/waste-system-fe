import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { TipTicket } from 'src/app/job-signoff-land-services/models/tip-ticket.model';
import { MaterialUpliftTicket } from 'src/app/order/models/material-uplift-ticket.model';
import { OrderMaterialUpliftValidatorService } from 'src/app/order/validators/order-material-uplift-validator.service';
import { MaterialUpliftTicketService } from '../../services/material-uplift-ticket.service';
import { OrderMaterialUpliftTicketValidatorService } from '../../validators/order-material-uplift-ticket-validator.service';

@Component({
  selector: 'app-material-uplift-edit',
  templateUrl: './material-uplift-edit.component.html',
  styleUrls: ['./material-uplift-edit.component.scss']
})
export class MaterialUpliftEditComponent implements OnInit {

  materialUpliftTicket: MaterialUpliftTicket = new MaterialUpliftTicket();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private orderMaterialUpliftTicketValidatorService: OrderMaterialUpliftTicketValidatorService,
    private materialUpliftTicketService: MaterialUpliftTicketService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadTicket(+params['id']);
    })
  }

  loadTicket(id: number): void {
    this.materialUpliftTicketService.getMaterialUpliftTicketById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((ticket: any) => {
      this.materialUpliftTicket = ticket;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.orderMaterialUpliftTicketValidatorService.isDataValid(this.materialUpliftTicket)) {
      // try to save it
      this.materialUpliftTicketService.updateMaterialUpliftTicket(this.materialUpliftTicket)
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
