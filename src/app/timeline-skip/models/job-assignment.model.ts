import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Account } from 'src/app/order/models/account.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { Job } from './job.model';

export class JobAssignment {
  id: number = -1;

  vehicle: Vehicle = new Vehicle();
  vehicleId: number = -1;
  trailerId: number = -1;
  trailer: Vehicle = new Vehicle();

  driver: Driver = new Driver();
  driverId: number = -1;

  subcontractor: Subcontractor = new Subcontractor();
  subcontractorId: number = -1;

  depot: Account = new Account();
  depotId: number = -1;

  name: string = '';

  // One to Many jobs
  jobs: Job[] = [];

  upcomingInspection: string = '';

  skipRoundId: number = -1;

  orderTypeId: number = -1;

  date: string = '';
  slotNumber: number = -1;
  driverStartTime: string = '';
  notes: string = '';

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
