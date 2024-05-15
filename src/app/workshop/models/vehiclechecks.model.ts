import { VehicleChecksAreas } from './vehiclecheckarea.model';
import { VehicleSeverity } from './vehicleseverity.model';

export class VehicleChecks {
  id: number = -1;
  checkInformation: string = '';
  severityDetail: VehicleSeverity = new VehicleSeverity();
  severity: number = -1
  isVor: boolean = false;
  vehicleTypeId: number = -1;
  vehicleCheckAreaId: number = -1;
  vehicleCheckArea: VehicleChecksAreas = new VehicleChecksAreas();
  vehicleCheckAreaDetails: any = [];
  active: boolean = true;
  editing: boolean = false;
  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
