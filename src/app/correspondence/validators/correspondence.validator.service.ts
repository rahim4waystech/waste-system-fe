import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';;
import { Correspondence } from '../models/correspondence.model';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceValidatorService extends ValidatorService {
  isValid(data: Correspondence) {
    this.errors = [];

    if(!this.isDropdownSupplied(data.correspondenceTypeId)) {
      this.errors.push('correspondenceTypeId');
    }


    if(!this.isSupplied(data.date)) {
      this.errors.push('date');
    }

    if(!this.isSupplied(data.subject)) {
      this.errors.push('subject');
    }
    return this.errors.length === 0;
  }
 }
