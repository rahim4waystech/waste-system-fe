import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { EnvironmentSettings } from '../models/environment-settings.model';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentValidatorService extends ValidatorService {
  isValid(data: EnvironmentSettings) {
    this.errors = [];
    

    if(!this.isSupplied(data.companyName)) {
      this.errors.push('companyName');
    }

    if(!this.isSupplied(data.comnpanyNumber)) {
      this.errors.push('comnpanyNumber');
    }

    if(!this.isSupplied(data.address1)) {
      this.errors.push('address1');
    }

    if(!this.isSupplied(data.address2)) {
      this.errors.push('address2');
    }

    if(!this.isSupplied(data.addressPostcode)) {
      this.errors.push('addressPostcode');
    }

    if(!this.isSupplied(data.addressEmail)) {
      this.errors.push('addressEmail');
    }

    if(!this.isSupplied(data.addressPhone)) {
      this.errors.push('addressPhone');
    }


    return this.errors.length === 0;
  }
}
