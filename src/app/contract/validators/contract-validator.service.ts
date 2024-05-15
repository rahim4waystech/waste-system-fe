import { Injectable } from '@angular/core';
import { Contract } from '../models/contract.model';
import { ValidatorService } from '../../core/validator/validator.service';


@Injectable({
  providedIn: 'root'
})
export class ContractValidatorService extends ValidatorService  {


  isValid(data: Contract) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    if(!this.isDropdownSupplied(data.contractStatusId)) {
      this.errors.push('contactStatusId');
    }

    if(!this.isDropdownSupplied(data.contractTypeId)) {
      this.errors.push('contractTypeId');
    }

    if(!this.isSupplied(data.startDate)) {
      this.errors.push('startDate');
    }

    if(!this.isSupplied(data.endDate)) {
      this.errors.push('endDate');
    }
  
    return this.errors.length === 0;
  }
}
