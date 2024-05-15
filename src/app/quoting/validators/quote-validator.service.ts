import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { User } from 'src/app/auth/models/user.model';
import { Product } from 'src/app/order/models/product.model';
import { QuoteLine } from 'src/app/order/models/quote-line-model';
import { Quote } from 'src/app/order/models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteValidatorService extends ValidatorService {
  isValid(data: Quote) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    // if(!this.isDropdownSupplied(data.accountId)) {
    //   this.errors.push('accountId');
    // }

    return this.errors.length === 0;
  }
 }
