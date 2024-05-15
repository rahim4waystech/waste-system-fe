import { Fitter } from "./fitter.model";

export class FitterHours {
    id: number = -1;


    fitterId: number = -1;
    fitter: Fitter = new Fitter();
  
    date: string = '';
    startTime: string = '';
    endTime: string = '';
    lunchBreak: number = 0;
    chargeableHours: number = 0;
    notes: string = '';
  
    createdBy: number = 0;
    createdAt: string = '';
    updatedAt: string = '';
}