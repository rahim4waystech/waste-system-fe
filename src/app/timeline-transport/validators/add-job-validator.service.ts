import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Job } from 'src/app/timeline-skip/models/job.model';

@Injectable({
  providedIn: 'root'
})
export class AddJobValidatorService extends ValidatorService {
  isValid(data: Job) {
    this.errors = [];

    if(!this.isSupplied(data.time)) {
      this.errors.push('time');
    }

    if(!this.isSupplied(data.qty)) {
      this.errors.push('qty');
    }

    return this.errors.length === 0;
  }
 }
