import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleSeverity } from './vehicleseverity.model';
import { VehicleInspectionIntervals } from './vehicleinspectionintervals.model';
import { VehicleChecksAreas } from './vehiclecheckarea.model';
import { WorkshopSubcontractors } from './workshop-subcontractors.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { Account } from 'src/app/order/models/account.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { DefectStatus } from './defect-status.model';

export class Defect {
  id: number = -1;

  vehicleId:number = -1;
  vehicle: Vehicle = new Vehicle();
  driverId: number = -1;
  driver: Driver = new Driver();
  driverReportStatus: number = -1;
  vehicleCheckAreaId: number = -1;
  vehicleCheckArea: VehicleChecksAreas = new VehicleChecksAreas();
  poNumber: string ='';
  description: string = '';
  bookedFor: string = '';
  vehicleSeverityId: number = -1;
  vehicleSeverity: VehicleSeverity = new VehicleSeverity();
  vehicleInspectionIntervalsId: number = -1;
  inspectionInterval: VehicleInspectionIntervals = new VehicleInspectionIntervals();
  started: string = '';
  ended: string = '';
  workshopSubcontractorsId: number = -1;
  subcontractor: Subcontractor = new Subcontractor();
  depotId: number = -1;
  depot: Account = new Account();
  defectStatus: DefectStatus = new DefectStatus();
  defectStatusId:number = 1;

  finalSignoff: string = null;
  signoffDate:string = '';
  signoffNotes: string = '';
  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
