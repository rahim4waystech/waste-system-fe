import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Driver } from '../models/driver.model';
import { DriverAbsence } from '../models/driver-absence.model';
import { DriverHours } from '../models/driver-hours.model';

@Injectable({
  providedIn: 'root'
})
export class DriverHoursValidatorService extends ValidatorService {
  isValid(data: DriverHours) {
    this.errors = [];

    if(!this.isDropdownSupplied(data.driverId)) {
      this.errors.push('driverId');
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
