import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Order } from '../models/order.model';
import { OrderLine } from '../models/order-line.model';

@Injectable({
  providedIn: 'root'
})
export class OrderLineValidatorService extends ValidatorService {
    isDataValid(data:OrderLine) {
        this.errors = [];
    
        if(!this.isDropdownSupplied(data.unitId)) {
          this.errors.push('unitId');
        }
    
        if(!this.isSupplied(data.name)) {
          this.errors.push('name');
        }
    
        if(!this.isSupplied(data.price)) {
          this.errors.push('price');
        }
    
        if(!this.isSupplied(data.qty)) {
          this.errors.push('qty');
        }
    
        return this.errors.length === 0;
      }
 }
