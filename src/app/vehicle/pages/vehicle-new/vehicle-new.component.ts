import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleValidatorService } from '../../validators/vehicle-validator.service';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleDetailService } from '../../../workshop/services/vehicledetails.service';
import { AssetService } from '../../../workshop/services/asset.service';
import { VehicleInspectionIntervalService } from '../../../workshop/services/vehicleinspections.service';
import { VehicleDetails } from '../../../workshop/models/vehicledetails.model';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-new',
  templateUrl: './vehicle-new.component.html',
  styleUrls: ['./vehicle-new.component.scss']
})
export class VehicleNewComponent implements OnInit {

  vehicle: Vehicle = new Vehicle();
  vehicleDetails: VehicleDetails = new VehicleDetails();
  inspectionAssignments: any = [];

  isError: boolean = false;
  isServerError: boolean = false;
  formSettings = {isVehicle:true,allowLink:false};
  linkedAssets: any = [];

  constructor(
    private vehicleValidator: VehicleValidatorService,
    private vehicleService: VehicleService,
    private vehicleDetailService: VehicleDetailService,
    private assetService:AssetService,
    private inspectionService: VehicleInspectionIntervalService
  ) { }

  ngOnInit(): void {
    this.vehicle.asset.categoryId = 1;
    this.vehicle.asset.category.id = 1;
  }

  onSubmit() {
    this.vehicle.asset.asset = this.vehicle.registration;
    if(this.vehicle.purchaseDate !== ''){this.vehicle.asset.purchaseDate = this.vehicle.purchaseDate;}
    if(this.vehicle.make !== ''){this.vehicle.asset.make = this.vehicle.make;}
    if(this.vehicle.model !== ''){this.vehicle.asset.model = this.vehicle.model;}
    if(this.vehicle.detail.dateOfFirstRegistration !== ''){this.vehicle.asset.dateOfRegistration = this.vehicle.detail.dateOfFirstRegistration}
    if(this.vehicle.depotId !== -1){
      this.vehicle.asset.depotId = this.vehicle.depotId;
      this.vehicle.asset.depot.id = this.vehicle.depotId;
    }

    this.isError = false;
    this.isServerError = false;

    if(this.vehicleValidator.isValid(this.vehicle)) {
      // try to save it
      let data:any = [];

      this.vehicleService.vehicleExists(this.vehicle.registration)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401){return e;}
          this.isServerError = true;
          return e;
        }))
        .subscribe(newData => {
          data = newData;
          if(data.length === 0){
            this.vehicleDetailService.createVehicle(this.vehicle.detail)
            .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save details');return e;}))
            .pipe(take(1))
            .subscribe((result:any) => {
              this.vehicle.detailId = result.id;
              this.vehicle.detail.id = result.id;

              this.assetService.createAsset(this.vehicle.asset)
              .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save details');return e;}))
              .pipe(take(1))
              .subscribe((assetResult:any) => {
                this.vehicle.assetId = assetResult.id;
                this.vehicle.asset.id = assetResult.id;
                this.vehicle.asset.entity = 'vehicle'

                this.vehicleService.createVehicle(this.vehicle)
                .pipe(take(1))
                .pipe(catchError((e) => {
                  if(e.status === 403 || e.status === 401){return e;}
                  this.isServerError = true;
                  return e;
                }))
                .subscribe(() => {
                  // move to edit mode
                  window.location.href = '/vehicles';
                })
              })
            })
          } else {
            alert('This registration is already on the system');
          }
        })
    } else {
      this.isError = true;
    }
  }

}
