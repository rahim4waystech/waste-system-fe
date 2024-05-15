import { OrderType } from './order-type.model';
import { Account } from './account.model';
import { OrderStatus } from './order-status.model';
import { ContainerSizeType } from 'src/app/container/models/container-size-type.model';
import { SkipOrderType } from './skip-order-type.model';
import { ContainerType } from 'src/app/container/models/container-type.model';
import { Grade } from 'src/app/container/models/grade.model';
import { ShredderOrderType } from './shredder-order-type.model';
import { ShreddingMethod } from './shredding-method.model';
import { Unit } from './unit.model';

export class Order {
  id: number = -1;

  orderTypeId: number = -1;
  orderType: OrderType = new OrderType();

  accountId: number = -1;
  account: Account = new Account();

  siteId: number = -1;
  site: Account = new Account();

  orderStatusId: number = -1;
  orderStatus: OrderStatus = new OrderStatus();

  skipOrderTypeId: number = -1;
  skipOrderType: SkipOrderType = new SkipOrderType();

  shredderOrderTypeId: number = -1;
  shredderOrderType: ShredderOrderType = new ShredderOrderType();

  shreddingMethodId: number = -1;
  shreddingMethod: ShreddingMethod = new ShreddingMethod();

  containerSizeTypeId: number = -1;
  containerSizeType: ContainerSizeType = new ContainerSizeType();

  containerTypeId: number = -1;
  containerType: ContainerType = new ContainerType();

  gradeId: number = -1;
  grade: Grade = new Grade();

  tipSiteId: number = -1;
  tipSite: Account = new Account();

  quotes: any = [];
  orderCount: number = 0;
  uniqueReference: string = '';

  orderAllocated: boolean = false;
  isPrepaid: boolean = false;

  tipFee: number = 0;
  tipUnitId: number = 1;
  employeeWageCost: number = 0;

  contractId: number = -1;

  date: string = '';
  time: string = '';
  description: string = '';
  driverNotes: string = '';
  poNumber: string = '';
  orderNumber: string = '';
  collectionNumber: string = '';
  companyName: string = '';
  contactName: string = '';
  contactTelephone: string = '';
  contactEmail: string = '';
  contactAddressLine1: string = '';
  contactAddressLine2: string = '';
  contactAddressLine3: string = '';
  contactCity: string = '';
  contactCountry: string = '';
  contactPostCode: string = '';
  sendConfirmationEmail: boolean = false;
  isContract: boolean = false;

  // Used for dragging jobs over to retain older time to reduce re-entry
  suggestedTime:string = '';

  // frontend variables
  qty:number = 0;
  allocated:number = 0;




  createdBy: number = -1;
  
  updatedBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';

  /**New Work**/

  ProvissionNotes: string = '';

  ProvissionId:number = -1;
}
