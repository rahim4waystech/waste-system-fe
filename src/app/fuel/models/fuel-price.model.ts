import { FuelType } from 'src/app/vehicle/models/fuel-type.model';

export class FuelPrice {
  id: number = -1;

  fuelTypeId: number = -1;

  fuelType: FuelType = new FuelType();


  effectiveDate: string = '';;
  price: number = 0;

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';

}

