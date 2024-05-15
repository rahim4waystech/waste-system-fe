import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { FitterAbsence } from '../models/fitter-absence.model';

@Injectable({
  providedIn: 'root'
})
export class FitterAbsenceValidatorService extends ValidatorService {
  isValid(data: FitterAbsence) {
    this.errors = [];

    if(!this.isDropdownSupplied(data.fitterId)) {
      this.errors.push('fitterId');
    }

    if(!this.isDropdownSupplied(data.fitterAbsenceTypeId)) {
      this.errors.push('fitterAbsenceTypeId');
    }

    if(!this.isSupplied(data.startDate)) {
      this.errors.push('startDate');
    }

    if(!this.isSupplied(data.endDate)) {
      this.errors.push('endDate');
    }

    return this.errors.length === 0;
  }
 }
