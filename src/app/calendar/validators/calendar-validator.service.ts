import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Calendar } from '../models/calendar.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarValidatorService extends ValidatorService {
  isValid(data: Calendar) {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    if(!this.isSupplied(data.colour)) {
      this.errors.push('colour');
    }
    
    return this.errors.length === 0;
  }
 }
