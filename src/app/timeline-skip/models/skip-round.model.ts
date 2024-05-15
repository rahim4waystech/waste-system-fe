import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { Account } from 'src/app/order/models/account.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';

export class SkipRound {
  id: number = -1;

  vehicle: Vehicle = new Vehicle();
  vehicleId: number = -1;

  driver: Driver = new Driver();
  driverId: number = -1;

  depot: Account = new Account();
  depotId: number = -1;
  trailerId: number = -1;

  subcontractor: Subcontractor = new Subcontractor();
  subcontractorId: number = -1;

  name: string = '';
  date: string = '';
  driverStartTime: string = '';
  carryOver: boolean = true;
  upcomingInspection: string = '';

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
