import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { User } from 'src/app/auth/models/user.model';
import { SkipRound } from '../models/skip-round.model';

@Injectable({
  providedIn: 'root'
})
export class SkipRoundValidatorService extends ValidatorService {
  isDataValid(data: SkipRound, optionType: string='own') {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    if(!this.isSupplied(data.driverStartTime)) {
      this.errors.push('driverStartTIme');
    }

    if(optionType === 'own') {
      if(!this.isDropdownSupplied(data.driverId)) {
        this.errors.push('driverId');
      }

      if(!this.isDropdownSupplied(data.vehicleId)) {
        this.errors.push('vehicleId');
      }
    }

    if(optionType === 'sub') {
      if(!this.isDropdownSupplied(data.subcontractorId)) {
        this.errors.push('subcontractorId');
      }
    }

    if(!this.isDropdownSupplied(data.depotId)) {
      this.errors.push('depotId');
    }

    return this.errors.length === 0;
  }
 }
