import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Driver } from '../models/driver.model';
import { DriverAbsence } from '../models/driver-absence.model';

@Injectable({
  providedIn: 'root'
})
export class DriverAbsenceValidatorService extends ValidatorService {
  isValid(data: DriverAbsence) {
    this.errors = [];

    if(!this.isDropdownSupplied(data.driverId)) {
      this.errors.push('driverId');
    }

    if(!this.isDropdownSupplied(data.driverAbsenceTypeId)) {
      this.errors.push('driverAbsenceTypeId');
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
