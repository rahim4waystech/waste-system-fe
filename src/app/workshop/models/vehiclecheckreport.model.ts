import { Driver } from 'src/app/driver/models/driver.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { DriverCheckStatus } from './driver-check-status.model';
import { VehicleChecks } from './vehiclechecks.model';

export class VehicleCheckReport {
  id: number = -1;
  vehicleCheckId: number = -1;
  vehicleCheck: VehicleChecks = new VehicleChecks();
  driverId: number = -1;
  driver:Driver = new Driver();
  vehicleId: number = -1
  vehicle: Vehicle = new Vehicle();

  checkStatusId:number = 0;
  checkStatus:DriverCheckStatus = new DriverCheckStatus();

  result:string ='';
  description:string = '';
  rejectionNote:string = '';
  overRide:string = '';
  driverCheckGroupId:number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
