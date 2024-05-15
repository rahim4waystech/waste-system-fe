import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Calendar } from '../models/calendar.model';
import { CalendarEvent } from '../models/calendar-event.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventValidatorService extends ValidatorService {
  isValid(data: CalendarEvent) {
    this.errors = [];

    if(!this.isSupplied(data.date)) {
      this.errors.push('date');
    }

    // if(!this.isSupplied(data.startTime)) {
    //   this.errors.push('startTime');
    // }

    // if(!this.isSupplied(data.endTime)) {
    //   this.errors.push('endTime');
    // }


    if(!this.isSupplied(data.name)) {
        this.errors.push('name');
      }


      
    
    return this.errors.length === 0;
  }
 }
