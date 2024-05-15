import { Driver } from './driver.model';

export class DriverHours {
  id: number = -1;

  driverId: number = -1;
  driver: Driver = new Driver();

  date: string = '';
  startTime: string = '';
  endTime: string = '';
  lunchBreak: number = 0;
  chargeableHours: number = 0;
  notes: string = '';

  createdAt: string = '';
  updatedAt: string = '';

}
