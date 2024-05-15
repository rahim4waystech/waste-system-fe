import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { EnvironmentSettings } from '../models/environment-settings.model';
import { UserGroup } from 'src/app/auth/models/user-group.model';

@Injectable({
  providedIn: 'root'
})
export class UserRoleValidatorService extends ValidatorService {
  isValid(data: UserGroup) {
    this.errors = [];


    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    return this.errors.length === 0;
  }
}
