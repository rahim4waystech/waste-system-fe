import { Vehicle } from './vehicle.model';

export class VehicleVOR {
  id: number = -1;

  vehicle: Vehicle = new Vehicle();
  vehicleId: number = -1;

  startDate: string = '';
  endDate: string = '';
  notes: string = '';
  deleted: boolean = false;

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';

}
