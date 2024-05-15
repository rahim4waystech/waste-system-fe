import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { FitterHours } from '../models/fitter-hours.model';

@Injectable({
  providedIn: 'root'
})
export class FitterHoursValidatorService extends ValidatorService {
  isValid(data: FitterHours) {
    this.errors = [];

    if(!this.isDropdownSupplied(data.fitterId)) {
      this.errors.push('fitterId');
    }


    if(!this.isSupplied(data.date)) {
      this.errors.push('date');
    }

    if(!this.isSupplied(data.startTime)) {
      this.errors.push('startTime');
    }

    if(!this.isSupplied(data.endTime)) {
      this.errors.push('endTime');
    }

    if(!this.isSupplied(data.chargeableHours)) {
      this.errors.push('chargeableHours');
    }

    return this.errors.length === 0;
  }
 }
