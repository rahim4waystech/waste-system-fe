import { Component, OnInit, Input } from '@angular/core';
import { VehicleVOR } from '../../models/vehicle-vor.model';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-vor-form',
  templateUrl: './vehicle-vor-form.component.html',
  styleUrls: ['./vehicle-vor-form.component.scss']
})
export class VehicleVorFormComponent implements OnInit {

  @Input()
  vehicleVOR: VehicleVOR;

  vehicles: Vehicle[] = [];

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.vehicleService.getAllVehicles()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Vehicles could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((vehicles: Vehicle[]) => {
      this.vehicles = vehicles;
      this.vehicles.push({id: -1, registration: 'Select a vehicle...'} as any);
    });
  }

}
