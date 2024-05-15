import { Component, OnInit, Input } from '@angular/core';
import { Fuel } from '../../models/fuel.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-fuel-form',
  templateUrl: './fuel-form.component.html',
  styleUrls: ['./fuel-form.component.scss']
})
export class FuelFormComponent implements OnInit {

  @Input()
  fuel: Fuel = new Fuel();

  vehicles: Vehicle[] = [];
  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load vehicles.');
      return e;
    }))
    .subscribe((vehicles: Vehicle[]) => {
      this.vehicles = vehicles;
    })
  }

}
