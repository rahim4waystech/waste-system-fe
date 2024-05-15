import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Account } from 'src/app/order/models/account.model';
import { TippingPrice } from '../models/tipping-price.model';

@Injectable({
  providedIn: 'root'
})
export class TippingPriceValidatorService extends ValidatorService {
  isValid(data: TippingPrice) {
    this.errors = [];

    if(!this.isSupplied(data.price) || data.price <= 0) {
      this.errors.push('main.price');
    }

    if(!this.isSupplied(data.effectiveDate)) {
      this.errors.push("main.effectiveDate");
    }

    if(!this.isDropdownSupplied(data.gradeId)) {
      this.errors.push('main.gradeId');
    }

    if(!this.isDropdownSupplied(data.unitId)) {
      this.errors.push('main.unitId');
    }

    return this.errors.length === 0;
  }
 }
