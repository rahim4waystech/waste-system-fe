import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { User } from 'src/app/auth/models/user.model';
import { Product } from 'src/app/order/models/product.model';
import { QuoteLine } from 'src/app/order/models/quote-line-model';

@Injectable({
  providedIn: 'root'
})
export class QuoteLineValidatorService extends ValidatorService {
  isValid(data: QuoteLine) {
    this.errors = [];

    if(!this.isSupplied(data.newPrice) || data.newPrice <= 0) {
      this.errors.push('newPrice');
    }

    if(!this.isSupplied(data.qty) || data.qty < 0) {
      this.errors.push('qty');
    }

    if(!this.isDropdownSupplied(data.productId)) {
      this.errors.push('productId');
    }

    return this.errors.length === 0;
  }
 }
