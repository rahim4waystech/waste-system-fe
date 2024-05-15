import { VehicleType } from 'src/app/vehicle/models/vehicle-type.model';
import { Unit } from 'src/app/order/models/unit.model';

export class ContainerSizeType {
  id: number = -1;

  size: number = 0;

  vehicleType: VehicleType = new VehicleType();
  vehicleTypeId: number = -1;

  unit: Unit = new Unit();
  unitId: number = -1;

  createdAt: string = '';
  updatedAt: string = '';

}
