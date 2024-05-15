import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { Fitter } from 'src/app/fitter/models/fitter.model';
import { Account } from 'src/app/order/models/account.model';

export class DefectAssignment {
  id: number = -1;

  subcontractor: Subcontractor = new Subcontractor();
  subcontractorId: number = -1;

  subcontractorDepot: Subcontractor = new Subcontractor();
  subcontractorDepotId: number = -1;

  depot: Account = new Account();
  depotId: number = -1;

  fitter: Fitter = new Fitter();
  fitterId: number = -1;

  fitterStartTime: string = '';
  date: string = '';

  name: string = '';


  defects: any[] = [];

  createdAt: string = '';
  updatedAt: string = '';
}
