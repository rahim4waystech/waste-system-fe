import { Incumbent } from './incumbent.model';

export class AccountIncumbents {
  id: number = -1;

  accountId: number = -1;
  incumbentId: number = -1;
  incumbent: Incumbent = new Incumbent();
  notes: string = '';
  active:boolean = true;

  createdAt: string = '';
  updatedAt: string = '';
}
