import { AssetCategory } from './asset-category.model';
import { Account } from 'src/app/order/models/account.model';
import { WorkshopSubcontractors } from './workshop-subcontractors.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { Part } from './part.model';

export class Asset {
  id: number = -1;
  parentId: number = -1;
  asset: string = '';
  assetSerial: string = '';
  make: string = '';
  model: string = '';
  description: string = '';
  dateOfRegistration: string = null;
  purchaseDate: string = null;
  value: number = 0;
  categoryId: number = -1;
  category: AssetCategory = new AssetCategory();
  entity: string = '';
  entityId: number = -1;
  depotId: number = -1;
  depot: Account = new Account();
  partId: number = -1;
  part: Part = new Part();
  active: boolean = true;
  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
