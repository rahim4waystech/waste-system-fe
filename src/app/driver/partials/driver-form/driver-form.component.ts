import { Component, OnInit, Input } from '@angular/core';
import { Driver } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';
import { catchError, take } from 'rxjs/operators';
import { DriverType } from '../../models/driver-type.model';
import { DriverBonusLevelService } from '../../services/driver-bonus-level.service';
import { DriverBonusLevel } from '../../models/driver-bonus-level.model';
import { Account } from 'src/app/order/models/account.model';
import { AccountService } from 'src/app/account/services/account.service';
import { environment } from 'src/environments/environment';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss']
})
export class DriverFormComponent implements OnInit {

  @Input()
  driver: Driver;

  types: DriverType[] = [];
  vehicles: Vehicle[] = [];
  trailers: Vehicle[] = [];

  levels: DriverBonusLevel[] = [];

  depots: Account[] = [];
  defaultEmployeePrefix: string = environment.defaults.employeeNoPrefix;
  defaultDepot:number = environment.defaults.defaultVehicleDepot;

  constructor(private driverService: DriverService,
    private accountService: AccountService,
    private vehicleService:VehicleService,
    private driverBonusLevelService: DriverBonusLevelService) { }

  ngOnInit(): void {
    this.driverService.countDrivers().subscribe((data:any) => {
      if(this.driver.employeeNumber === ''){
        this.driver.employeeNumber = this.defaultEmployeePrefix + (data.length + 1);
      }

      if(this.driver.depotId === -1){
        this.driver.depotId = this.defaultDepot;
        this.driver.depot.id = this.defaultDepot;
      }
    })

    this.driverService.getAllDriverTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('driver types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: DriverType[]) => {
      this.types = types;
    });

    this.vehicleService.getAllVehicles()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}
    alert('Cannot get vehicles');return e;}))
    .pipe(take(1))
    .subscribe((vehicles: Vehicle[]) => {

      this.vehicles = vehicles.filter(f=>f.vehicleTypeId !== 7);

      
      this.trailers = vehicles.filter(f=>f.vehicleTypeId === 7);
      this.vehicles.unshift({id: -1, registration: 'Select a perferred Vehicle...', vehicleType: {name: 'N/A'}} as any)
      this.trailers.unshift({id: -1, registration: 'Select a perferred Trailer...', vehicleType: {name: 'N/A'}, vinNumber: 'N/A' } as any);


    })

    this.driverBonusLevelService.getAllDriverBonusLevels()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('driver bonus levels could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((levels: DriverBonusLevel[]) => {
      this.levels = levels;
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
    });
  }

}
