import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleType } from '../../models/vehicle-type.model';
import { take, catchError } from 'rxjs/operators';
import { FuelType } from '../../models/fuel-type.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { environment } from 'src/environments/environment';
import { SecondaryVehicleType } from '../../models/secondary-vehicle-type.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Driver } from 'src/app/driver/models/driver.model';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent implements OnInit {

  @Input()
  vehicle: Vehicle = new Vehicle();

  types: VehicleType[] = [];
  secondaryTypes: SecondaryVehicleType[] = [];
  fuelTypes: FuelType[] = [];

  depots: Account[] = [];
  vehicleWeightUnit:string= '';
  drivers: Driver[] = [];

  constructor(
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.vehicleWeightUnit = environment.defaults.tareWeightUnit;


    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load drivers');
      return e;
    }))
    .subscribe((drivers: any) => {
      this.drivers = drivers;
    })

    this.vehicleService.getAllVehicleTypes()
    .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Vehicle types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: VehicleType[]) => {
      this.types = types;
    });

    this.vehicleService.getAllFuelTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('fuel types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: FuelType[]) => {
      this.fuelTypes = types;
    });

    this.accountService.getAllDepots()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('depots could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((depots: Account[]) => {
      this.depots = depots;
      this.depots.unshift({id: -1, name: 'Select a depot'} as any);
    });

    if(this.vehicle.depotId === -1){
      this.vehicle.depotId = environment.defaults.defaultVehicleDepot;
      this.vehicle.depot.id = environment.defaults.defaultVehicleDepot;
    }
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.vehicle !== undefined){
      if(changes.vehicle.currentValue.id !== -1){
        this.vehicleService.getSecondaryVehicleTypesByTypeId(+this.vehicle.vehicleTypeId)
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('secondary Types could not be loaded');
          return e;
        }))
        .pipe(take(1))
        .subscribe((secondaryTypes: SecondaryVehicleType[]) => {
          this.secondaryTypes = secondaryTypes;
        });
      }
    }
  }

  updateSecondaries(event){
    this.secondaryTypes = [];
    this.vehicle.secondaryVehicleTypeId = -1;
    this.vehicle.secondaryVehicleType = new SecondaryVehicleType();

    this.vehicle.secondaryVehicleTypeId = parseInt(event.target.value,10);
    this.vehicle.secondaryVehicleType.id = parseInt(event.target.value,10);

    this.vehicleService.getSecondaryVehicleTypesByTypeId(this.vehicle.vehicleTypeId)
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('secondary Types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((secondaryTypes: SecondaryVehicleType[]) => {
      this.secondaryTypes = secondaryTypes;
    });

  }

  getSecondaries(){
    this.vehicleService.getSecondaryVehicleTypesByTypeId(this.vehicle.vehicleTypeId)
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('secondary Types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((secondaryTypes: SecondaryVehicleType[]) => {
      this.secondaryTypes = secondaryTypes;
    });
  }

  show(){
  }

  updateDepot(event){
    const depotId = parseInt(event,10);

    this.vehicle.depotId = depotId;
    this.vehicle.depot = {id:depotId} as any;
    this.vehicle.asset.depot = {id:depotId} as any;
    this.vehicle.asset.depotId = depotId;
  }

}
