import { Component, OnInit, Input } from '@angular/core';
import { DvlaService } from '../../services/dvla.service';
import { catchError, take } from 'rxjs/operators';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import * as moment from 'moment';

@Component({
  selector: 'app-dvla-reg',
  templateUrl: './dvla-reg.component.html',
  styleUrls: ['./dvla-reg.component.scss']
})
export class DvlaRegComponent implements OnInit {
  @Input()
  vehicle:Vehicle = new Vehicle();

  detailsFound = '';

  constructor(
    private dvlaService: DvlaService
  ) { }

  ngOnInit(): void {
  }

  getByReg(){
    this.dvlaService.getByRegistration(this.vehicle.registration)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get from DVLA');return e;}))
    .pipe(take(1))
    .subscribe(dvla => {
      this.parseData(dvla);
    })
  }

  getByVin(){
    this.dvlaService.getByVin(this.vehicle.vinNumber)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get from DVLA');return e;}))
    .pipe(take(1))
    .subscribe(dvla => {
      this.parseData(dvla);
    })
  }

  parseData(data){
    const vehicleData = data['Response']['DataItems']['VehicleRegistration'];
    this.detailsFound = data['Response']['StatusMessage'];

    // VEHICLE
    this.vehicle.registration = vehicleData['Vrm'];
    this.vehicle.vinNumber = vehicleData['Vin'];
    this.vehicle.make = vehicleData['Make'];
   	this.vehicle.model = vehicleData['Model'];

    switch(vehicleData['FuelType']){
      case 'DIESEL': this.vehicle.fuelTypeId = 1;this.vehicle.fuelType.id = 1; break;
      case 'PETROL': this.vehicle.fuelTypeId = 3;this.vehicle.fuelType.id = 3; break;
      case 'ELECTRIC': this.vehicle.fuelTypeId = 4;this.vehicle.fuelType.id = 4; break;
      case 'GASOIL': this.vehicle.fuelTypeId = 2;this.vehicle.fuelType.id = 2; break;
    }

    // VEHICLE DETAIL

    this.vehicle.detail.engineCylinderCapacity = vehicleData['EngineCapacity'];
  	this.vehicle.detail.dateOfFirstRegistration = moment(vehicleData['DateFirstRegistered'],'YYYY-MM').format('YYYY-MM-DD');
  	this.vehicle.detail.yearOfManufacture = vehicleData['YearOfManufacture'];
    this.vehicle.detail.co2Emissions = vehicleData['Co2Emissions'];
    this.vehicle.detail.wheelPlan = vehicleData['WheelPlan'];
    this.vehicle.detail.doorPlan = vehicleData['DoorPlan'];
		this.vehicle.detail.doorPlanLiteral = vehicleData['DoorPlanLiteral'];
		this.vehicle.detail.engineNumber = vehicleData['EngineNumber'];
    this.vehicle.detail.seatingCapacity = vehicleData[' SeatingCapacity'];
		this.vehicle.detail.transmission = vehicleData['Transmission'];
		this.vehicle.detail.transmissionCode = vehicleData['TransmissionCode'];
		this.vehicle.detail.transmissionType = vehicleData['TransmissionType'];

    // ASSET
    this.vehicle.asset.make = vehicleData['Make'];
   	this.vehicle.asset.model = vehicleData['Model'];
    this.vehicle.asset.dateOfRegistration = moment(vehicleData['DateFirstRegistered'],'YYYY-MM').format('YYYY-MM-DD');
  }

}
