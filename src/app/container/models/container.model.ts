import { ContainerType } from './container-type.model';
import { ContainerGroup } from './container-group.model';
import { ContainerSizeType } from './container-size-type.model';
import { Account } from 'src/app/order/models/account.model';

export class Container {
  id: number = -1;

  containerType: ContainerType = new ContainerType();
  containerTypeId: number = -1;

  containerGroup: ContainerGroup;
  containerGroupId: number = -1;

  containerSizeType: ContainerSizeType;
  containerSizeTypeId: number = -1;

  skipLocationId: number = -1;
  skipLocation: Account = new Account();

  name: string = '';
  serialNumber: string = '';
  notes: string = '';
  active: boolean = false;

  createdBy:number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
