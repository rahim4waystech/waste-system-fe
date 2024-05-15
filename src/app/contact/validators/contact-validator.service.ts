import { Injectable } from '@angular/core';
import { ValidatorService } from '../../core/validator/validator.service';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactValidatorService extends ValidatorService {

  isValid(data: Contact) {
    this.errors = [];

    if(!this.isSupplied(data.firstName)) {
      this.errors.push('main.firstName');
    }

    if(!this.isSupplied(data.lastName)) {
      this.errors.push('main.lastName');
    }

    if(!this.isSupplied(data.businessPhone)) {
      this.errors.push('contact.businessPhone');
    }

    if(!this.isDropdownSupplied(data.roleId)) {
      this.errors.push('main.roleId');
    }

    return this.errors.length === 0;
  }
}
