import { DriverType } from './driver-type.model';
import { Account } from 'src/app/order/models/account.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';

export class Driver {
  id: number = -1;

  driverTypeId: number = -1;
  driverType: DriverType = new DriverType();

  depotId: number = -1;
  depot: Account = new Account();

  vehicleId: number = -1;
  vehicle: Vehicle = new Vehicle();

  trailerId: number = -1;
  trailer: Vehicle = new Vehicle();

  driverBonusLevelId: number = -1;

  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  contact: string = '';
  workNumber: string = '';
  employeeNumber: string = '';
  active: boolean = false;
  notes: string = '';

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
