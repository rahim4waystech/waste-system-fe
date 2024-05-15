import { Component, OnInit, Input } from '@angular/core';
import { FuelPrice } from '../../models/fuel-price.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { FuelType } from 'src/app/vehicle/models/fuel-type.model';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-fuel-price-form',
  templateUrl: './fuel-price-form.component.html',
  styleUrls: ['./fuel-price-form.component.scss']
})
export class FuelPriceFormComponent implements OnInit {

  @Input()
  fuelPrice: FuelPrice = new FuelPrice();

  types: FuelType[] = [];
  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.vehicleService.getAllFuelTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load fuel types.');
      return e;
    }))
    .subscribe((types: FuelType[]) => {
      this.types = types;
    })
  }

}
