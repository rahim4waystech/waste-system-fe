import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { User } from 'src/app/auth/models/user.model';
import { Product } from 'src/app/order/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductValidatorService extends ValidatorService {
  isValid(data: Product) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    if(!this.isSupplied(data.price) || data.price <= 0) {
      this.errors.push('price');
    }

    if(!this.isDropdownSupplied(data.unitId)) {
      this.errors.push('unitId');
    }

    return this.errors.length === 0;
  }
 }
