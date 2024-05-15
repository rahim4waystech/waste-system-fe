import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { User } from 'src/app/auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserValidatorService extends ValidatorService {
  isValid(data: User) {
    this.errors = [];

    if(!this.isSupplied(data.email)) {
      this.errors.push('email');
    }

    if(!this.isSupplied(data.firstName)) {
      this.errors.push('firstName');
    }

    if(!this.isSupplied(data.lastName)) {
      this.errors.push('lastName');
    }

    if(!this.isDropdownSupplied(data.userGroupId)) {
      this.errors.push('userGroupId');
    }

    if(data.id === -1) {
      if(!this.isSupplied(data.password)) {
        this.errors.push('password');
      }
    }

    return this.errors.length === 0;
  }
 }
