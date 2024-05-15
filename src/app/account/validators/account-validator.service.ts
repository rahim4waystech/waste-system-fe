import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Account } from 'src/app/order/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountValidatorService extends ValidatorService {
  isValid(data: Account) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('main.name');
    }

    if(data.type_id === 3  || data.type_id === 13) {
      if(!this.isSupplied(data.accountRef)) {
        this.errors.push('main.accountRef');
      }
    }

    if(!this.isDropdownSupplied(data.type_id)) {
      this.errors.push('main.type_id');
    }



    return this.errors.length === 0;
  }
 }
