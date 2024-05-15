import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { YardTrade } from '../models/yard-trade.model';
import { YardTradePricing } from '../models/yard-trade-pricing.model';

@Injectable({
  providedIn: 'root'
})
export class YardTradeValidatorService extends ValidatorService {
  isDataValid(data: YardTrade, pricing: YardTradePricing[]) {
    this.errors = [];

    if(!this.isSupplied(data.ticketNumber)) {
      this.errors.push('main.ticketNumber');
    }

    if(!this.isDropdownSupplied(data.depotId)) {
      this.errors.push('main.depotId');
    }

    if(!this.isDropdownSupplied(data.gradeId)) {
      this.errors.push('main.gradeId');
    }

    if(!this.isSupplied(data.grossWeight)) {
      this.errors.push('main.grossWeight');
    }


    if(!this.isSupplied(data.tareWeight)) {
      this.errors.push('main.tareWeight');
    }


    if(pricing !== null) {
      if(pricing.length === 0) {
        this.errors.push('product.pricing');
      }
    }

    return this.errors.length === 0;
  }
 }
