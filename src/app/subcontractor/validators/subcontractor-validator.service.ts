import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Subcontractor } from '../models/subcontractor.model';

@Injectable({
  providedIn: 'root'
})
export class SubcontractorValidatorService extends ValidatorService {
  isValid(data: Subcontractor) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    return this.errors.length === 0;
  }
 }
