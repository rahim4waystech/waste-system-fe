import { DriverJobStatus } from './driver-job-status.model';

export class DriverJobStatusDetails {
    id: number = -1;

    vehicleId: number = -1;
    driverId: number = -1;
    jobId: number = -1;
    date: string = '';
    time: string = '';
    driverJobStatusId: number = -1;
    driverJobStatus: DriverJobStatus = new DriverJobStatus();
    gpsLat: number = 0;
    gpsLong: number = 0;
  
    createdAt: string = '';
    updatedAt: string = '';
  
}