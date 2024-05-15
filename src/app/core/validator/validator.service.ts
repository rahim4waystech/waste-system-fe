import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  errors: any = {};

  getErrors(): any {
    return this.errors;
  }

  setErrors(errors: any) {
    this.errors = errors;
  }

  // Stubbed for now implement in child class
  isValid(data:any): boolean {
    return false;
  }

  protected isSupplied(value) {
    if(value !== '' && value !== null && value !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  protected isDropdownSupplied(value) {
    if(value !== '' && value !== null && value !== undefined && value !== -1) {
      return true;
    } else {
      return false;
    }
  }



}
