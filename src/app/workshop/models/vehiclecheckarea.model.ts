import { VehicleType } from 'src/app/vehicle/models/vehicle-type.model';

export class VehicleChecksAreas {
  id: number = -1;
  name: string = '';
  vehicleTypeId: number = -1
  vehicleType:VehicleType = new VehicleType();
  icon: string = '';
  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
