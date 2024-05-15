import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { MaterialUplift } from '../models/material-uplift.model';

@Injectable({
  providedIn: 'root'
})
export class OrderMaterialUpliftValidatorService extends ValidatorService {

  isDataValid(data:MaterialUplift) {
    this.errors = [];

    if(!this.isDropdownSupplied(data.accountId)) {
      this.errors.push('accountId');
    }


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
