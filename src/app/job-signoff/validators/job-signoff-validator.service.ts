import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Job } from 'src/app/timeline-skip/models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobSignOffValidatorService extends ValidatorService {
  isValid(data: Job) {
    this.errors = [];

    if(!this.isSupplied(data.order.date)) {
      this.errors.push('date');
    }

    if(!this.isSupplied(data.order.time)) {
      this.errors.push('time');
    }
    return this.errors.length === 0;
  }
 }
