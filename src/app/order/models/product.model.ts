import { Unit } from './unit.model';

export class Product {
  id: number = -1;

  unitId: number = -1;
  unit: Unit = new Unit();

  name: string = '';
  displayName: string = '';
  price:number = 0;
  active: boolean = false;

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
