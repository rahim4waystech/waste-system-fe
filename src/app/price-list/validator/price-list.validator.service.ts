import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';import { PriceList } from '../models/price-list.model';
;

@Injectable({
  providedIn: 'root'
})
export class PriceListValidatorService extends ValidatorService {
  isValid(data: PriceList) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }
    return this.errors.length === 0;
  }
 }
