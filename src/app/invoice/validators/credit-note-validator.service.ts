import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { CreditNote } from '../models/credit-note.model';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteValidatorService extends ValidatorService {
  isValid(note: CreditNote) {
    this.errors = [];

    if(!this.isSupplied(note.date)) {
      this.errors.push('date');
    }

    if(!this.isSupplied(note.description)) {
      this.errors.push('description');
    }

    if(!this.isSupplied(note.value)) {
      this.errors.push('value');
    }
    return this.errors.length === 0;
  }
}
