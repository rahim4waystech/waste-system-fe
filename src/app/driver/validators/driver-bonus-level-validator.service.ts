import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { DriverBonusLevel } from '../models/driver-bonus-level.model';

@Injectable({
  providedIn: 'root'
})
export class DriverBonusLevelValidatorService extends ValidatorService {
  isValid(data: DriverBonusLevel) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    if(!this.isSupplied(data.value)) {
      this.errors.push('value');
    }

    return this.errors.length === 0;
  }
 }
