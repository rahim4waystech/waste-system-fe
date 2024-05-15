import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Defect } from './defect.model';
import { VehicleInspectionIntervals } from './vehicleinspectionintervals.model';

export class InspectionDates {
  id: number = -1;
  vehicleId = -1;
  vehicle: Vehicle = new Vehicle();
  inspectionIntervalId = -1;
  inspectionInterval: VehicleInspectionIntervals = new VehicleInspectionIntervals();
  defectId = -1;
  defect: Defect = new Defect();
  date = '';
  createdAt: string = '';
  updatedAt: string = '';
}
