import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';;
import { Correspondence } from '../models/correspondence.model';
import { EmailLog } from '../models/email-log.model';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService extends ValidatorService {
  isValid(data: EmailLog) {
    this.errors = [];

    if(!this.isSupplied(data.to)) {
      this.errors.push('to');
    }

    if(!this.isSupplied(data.content)) {
        this.errors.push('content');
      }

    if(!this.isSupplied(data.subject)) {
      this.errors.push('subject');
    }
    return this.errors.length === 0;
  }
 }
