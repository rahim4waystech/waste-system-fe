import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Container } from '../models/container.model';

@Injectable({
  providedIn: 'root'
})
export class ContainerValidatorService extends ValidatorService {
  isValid(data: Container) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    if(!this.isDropdownSupplied(data.containerGroupId)) {
      this.errors.push('containerGroupId');
    }

    if(!this.isDropdownSupplied(data.containerTypeId)) {
      this.errors.push('containerTypeId');
    }

    if(data.containerGroupId < 3 || data.containerGroupId > 4){
      if(!this.isDropdownSupplied(data.containerSizeTypeId)) {
        this.errors.push('containerSizeTypeId');
      }
    }

    return this.errors.length === 0;
  }
 }
