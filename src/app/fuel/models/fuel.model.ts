import { Vehicle } from 'src/app/vehicle/models/vehicle.model';

export class Fuel {
  id: number;

  vehicleId: number = -1;
  vehicle: Vehicle = new Vehicle();

  fuel: number = 0;
  mileage: number = 0;
  date: string = '';
  notes: string = '';

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
