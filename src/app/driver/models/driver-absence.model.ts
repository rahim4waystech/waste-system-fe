import { Driver } from './driver.model';
import { DriverAbsenceType } from './driver-absence-type.model';

export class DriverAbsence {
  id: number = -1;

  driverId: number = -1;
  driver: Driver = new Driver();

  driverAbsenceTypeId: number = -1;
  driverAbsenceType: DriverAbsenceType = new DriverAbsenceType();

  startDate: string = '';
  endDate: string = '';
  notes: string = '';

  createdAt: string = '';
  updatedAt: string = '';
}
