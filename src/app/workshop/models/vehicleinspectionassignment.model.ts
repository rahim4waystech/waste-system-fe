import { VehicleInspectionIntervals } from './vehicleinspectionintervals.model';

export class VehicleInspectionAssignments {
  id: number = -1;
  vehicleDetailId:number = -1;
  vehicleInspectionIntervalId:number = -1;
  vehicleInspectionDetails: VehicleInspectionIntervals = new VehicleInspectionIntervals();
  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
