import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Vehicle } from '../models/vehicle.model';
import { VehicleVOR } from '../models/vehicle-vor.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleVORValidatorService extends ValidatorService {
  isValid(data: VehicleVOR) {
    this.errors = [];

    if(!this.isSupplied(data.startDate)) {
      this.errors.push('startDate');
    }

    if(!this.isDropdownSupplied(data.vehicleId)) {
      this.errors.push('vehicleId');
    }

    if(!this.isSupplied(data.endDate)) {
      this.errors.push('endDate');
    }

    return this.errors.length === 0;
  }
 }
