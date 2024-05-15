import { Injectable } from '@angular/core';
import { DefectAssignment } from 'src/app/timeline-transport/models/defect-assignment.model';
import { ValidatorService } from 'src/app/core/validator/validator.service';

@Injectable({
  providedIn: 'root'
})
export class DefectAssignmentValidatorService extends ValidatorService {


  isDataValid(data: DefectAssignment, optionType:string='own') {
    this.errors = [];

    if(!this.isSupplied(data.name)) {
      this.errors.push('name');
    }

    if(!this.isSupplied(data.fitterStartTime)) {
      this.errors.push('fitterStartTime');
    }

    if(optionType === 'own') {
      if(!this.isDropdownSupplied(data.fitterId)) {
        this.errors.push('fitterId');
      }

      if(!this.isDropdownSupplied(data.depotId)) {
        this.errors.push('depotId');
      }
    }

    if(optionType === 'sub') {
      if(!this.isDropdownSupplied(data.subcontractorId)) {
        this.errors.push('subcontractorId');
      }

      if(!this.isDropdownSupplied(data.subcontractorDepotId)) {
        this.errors.push('subcontractorDepotId');
      }
    }

    return this.errors.length === 0;
  }
}
