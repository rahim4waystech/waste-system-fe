import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Fitter } from '../models/fitter.model';

@Injectable({
  providedIn: 'root'
})
export class FitterValidatorService extends ValidatorService {
  isValid(data: Fitter) {
    this.errors = [];

    if(!this.isSupplied(data.lastName)) {
      this.errors.push('lastName');
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
