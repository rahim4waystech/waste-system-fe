import { Vehicle } from 'src/app/vehicle/models/vehicle.model';

export class VehicleDetails {
  id: number = -1;
  engineCylinderCapacity:number = 0;
  dateOfFirstRegistration: string = null;
  yearOfManufacture: string = '';
  co2Emissions: string = '';
  typeApproval: string = '';
  wheelPlan: string = '';
  fleetNo: string = '';
  inspectionIntervalId:number = -1;
  inspectionIntervals: any = [];
  doorPlan: string = '';
  doorPlanLiteral: string = '';
  engineNumber: string = '';
  seatingCapacity: number = 0;
  transmission: string = '';
  transmissionCode: string = '';
  transmissionType: string = '';
  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
