import { VehicleType } from './vehicle-type.model';
import { FuelType } from './fuel-type.model';
import { Account } from 'src/app/order/models/account.model';
import { Asset } from 'src/app/workshop/models/asset.model';
import { VehicleDetails } from 'src/app/workshop/models/vehicledetails.model';
import { SecondaryVehicleType } from './secondary-vehicle-type.model';

export class Vehicle {
  id: number = -1;

  vehicleTypeId: number = -1;
  vehicleType: VehicleType = new VehicleType();

  secondaryVehicleTypeId: number = -1;
  secondaryVehicleType: SecondaryVehicleType = new SecondaryVehicleType();

  fuelTypeId: number = -1;
  fuelType: FuelType = new FuelType();

  depotId: number = -1;
  depot: Account = new Account();

  assetId: number = -1;
  asset: Asset = new Asset();

  detailId: number = -1;
  detail: VehicleDetails = new VehicleDetails();

  registration: string = '';
  distanceUnit : string = '';
  vinNumber: string = '';
  name: string = '';
  make: string = '';
  model: string = '';
  tareWeight: number = 0;
  purchaseDate: string = null;
  lastServiceDate: string = null;
  driverId: number = -1;
  notes: string = '';
  active: boolean = true;
  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
