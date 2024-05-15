import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { FuelPrice } from '../models/fuel-price.model';
import { Fuel } from '../models/fuel.model';

@Injectable({
  providedIn: 'root'
})
export class FuelValidatorService extends ValidatorService {
  isValid(data: Fuel) {
    this.errors = [];

    if(!this.isSupplied(data.date)) {
      this.errors.push('date');
    }

    if(!this.isSupplied(data.mileage)) {
      this.errors.push('mileage');
    }

    if(!this.isSupplied(data.fuel)) {
      this.errors.push('fuel');
    }

    if(!this.isDropdownSupplied(data.vehicleId)) {
      this.errors.push('vehicleId');
    }

    return this.errors.length === 0;
  }
 }
