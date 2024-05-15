import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { FuelPrice } from '../models/fuel-price.model';

@Injectable({
  providedIn: 'root'
})
export class FuelPriceValidatorService extends ValidatorService {
  isValid(data: FuelPrice) {
    this.errors = [];

    if(!this.isSupplied(data.price)) {
      this.errors.push('registration');
    }

    if(!this.isSupplied(data.effectiveDate)) {
      this.errors.push('effectiveDate');
    }

    if(!this.isDropdownSupplied(data.fuelTypeId)) {
      this.errors.push('fuelTypeId');
    }

    return this.errors.length === 0;
  }
 }
