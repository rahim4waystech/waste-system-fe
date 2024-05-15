import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleValidatorService extends ValidatorService {
  isValid(data: Vehicle) {
    this.errors = [];

    if(!this.isSupplied(data.registration)) {
      this.errors.push('registration');
    }

    if(!this.isDropdownSupplied(data.vehicleTypeId)) {
      this.errors.push('vehicleTypeId');
    }

    if(data.vehicleTypeId !== 7){
      if(!this.isDropdownSupplied(data.fuelTypeId)) {
        this.errors.push('fuelTypeId');
      }
    }


    // Currently not required, but save it just in case
    // if(!this.isSupplied(data.name)) {
    //   this.errors.push('name');
    // }

    if(!this.isSupplied(data.vinNumber)) {
      this.errors.push('vinNumber');
    }


    // if(!this.isSupplied(data.tareWeight)) {
    //   this.errors.push('tareWeight');
    // }

    return this.errors.length === 0;
  }
 }
