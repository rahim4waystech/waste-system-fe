import { Fitter } from "./fitter.model";

export class FitterAbsence {
    id: number = -1;

    fitterId: number = -1;
    fitter: Fitter = new Fitter();
    
    fitterAbsenceTypeId: number = -1;
    fitterAbsenceType: any = {};
  
    
    startDate: string = '';
    endDate: string = '';
    notes: string = '';
  
    createdBy: number = 0;
  
    createdAt: string = '';
    updatedAt: string = '';
}