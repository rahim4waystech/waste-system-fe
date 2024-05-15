import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { MaterialUpliftTicket } from 'src/app/order/models/material-uplift-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class OrderMaterialUpliftTicketValidatorService extends ValidatorService {

  isDataValid(data:MaterialUpliftTicket) {
    this.errors = [];

    if(!this.isDropdownSupplied(data.accountId)) {
      this.errors.push('accountId');
    }

    if(!this.isDropdownSupplied(data.jobId)) {
        this.errors.push('jobId');
      }

    if(!this.isDropdownSupplied(data.unitId)) {
      this.errors.push('unitId');
    }

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    if(!this.isSupplied(data.price)) {
      this.errors.push('price');
    }

    if(!this.isSupplied(data.qty)) {
      this.errors.push('qty');
    }
    return this.errors.length === 0;
  }
}
