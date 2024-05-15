import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { TipTicket } from 'src/app/job-signoff-land-services/models/tip-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TipTicketValidatorService extends ValidatorService {
  isValid(data: TipTicket) {
    this.errors = [];

    if(!this.isSupplied(data.jobId)) {
      this.errors.push('jobId');
    }

    return this.errors.length === 0;
  }
 }
