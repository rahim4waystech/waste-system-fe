import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverValidatorService extends ValidatorService {
  isValid(data: Driver) {
    this.errors = [];

    if(!this.isSupplied(data.lastName)) {
      this.errors.push('lastName');
    }

    if(!this.isDropdownSupplied(data.driverTypeId)) {
      this.errors.push('driverTypeId');
    }

    // if(!this.isDropdownSupplied(data.depotId)) {
    //   this.errors.push('depotId');
    // }

    if(!this.isSupplied(data.firstName)) {
      this.errors.push('firstName');
    }

    return this.errors.length === 0;
  }
 }
