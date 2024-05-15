import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { take, catchError } from 'rxjs/operators';
import { VehicleValidatorService } from '../../validators/vehicle-validator.service';
import { AssetService } from '../../../workshop/services/asset.service';
import { VehicleInspectionIntervalService } from '../../../workshop/services/vehicleinspections.service';
import { VehicleDetails } from '../../../workshop/models/vehicledetails.model';
import { VehicleDetailService } from '../../../workshop/services/vehicledetails.service';
import { Asset } from 'src/app/workshop/models/asset.model';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.scss']
})
export class VehicleEditComponent implements OnInit {

  vehicle: Vehicle = new Vehicle();

  inspectionAssignments: any = {intervals:[]};
  linkedAssets: any = [];
  inspectionIntervals: any = [];
  oldInspectionAssignments: any = [];

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;
  formSettings = {isVehicle:true,allowLink:false};

  constructor(private route: ActivatedRoute,
    private vehicleValidator: VehicleValidatorService,
    private vehicleService: VehicleService,
    private vehicleDetailService: VehicleDetailService,
    private assetService:AssetService,
    private inspectionService: VehicleInspectionIntervalService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadVehicle(+params['id']);
    })
    this.inspectionService.getAllInspectionIntervalsByEntity('vehicle')
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Inspection Intervals could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((intervals: any) => {
      this.inspectionIntervals = intervals;
    });
  }

  loadVehicle(id: number): void {
    this.vehicleService.getVehicleById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      this.isServerError = true;
      return e;
    }))
    .subscribe((vehicle: Vehicle) => {
      this.vehicle = vehicle;

      this.inspectionService.getAllInspectionAssignmentsByVehicle(this.vehicle.detailId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;};alert('Could not get Inspections');return e;}))
      .pipe(take(1))
      .subscribe((inspections:any) => {
        inspections.forEach(item => {
          this.inspectionAssignments.intervals.push(this.inspectionIntervals.filter(f=>f.id === item.vehicleInspectionIntervalId)[0]);

          this.inspectionAssignments.intervals.forEach(interval => {
            this.inspectionService.getLastInspectionByVehicleIdAndIntervalId(this.vehicle.id,interval.id)
            .pipe(catchError((e)=>{
              if(e.status === 403 || e.status === 401){return e;}
              alert('Could not get last inspections');
              return e;
            }))
            .pipe(take(1))
            .subscribe((lastDate:any) => {

              if(lastDate.length > 0){
                  interval.lastDate = lastDate[0].date;
              } else {
                interval.lastDate = '';
              }
            })
          })
        })
        this.oldInspectionAssignments = inspections;
      })

      if(this.vehicle.assetId === -1 || this.vehicle.detailId === -1){
        this.addDetail();
      } else {

        this.getChildAssets();
      }
    })
  }

  addDetail(){
    if(this.vehicle.detailId === -1){
      this.vehicle.detail = new VehicleDetails();
      this.vehicleDetailService.createVehicle(this.vehicle.detail)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;};alert('Could not create details');return e;}))
      .pipe(take(1))
      .subscribe((result:any) => {
        this.vehicle.detailId = result.id;
        this.vehicle.detail.id = result.id;


        if(this.vehicle.assetId === -1){
          this.addAsset();
        } else {
          this.vehicleService.updateVehicle(this.vehicle)
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;};alert('Could not save details');return e;}))
          .pipe(take(1))
          .subscribe(() => {
            this.addAsset();
          })
        }
      });
    } else {
      this.addAsset();
    }

  }

  addAsset(){
    if(this.vehicle.assetId === -1){
      this.vehicle.asset = new Asset();
      this.vehicle.asset.asset = this.vehicle.registration;
      this.vehicle.asset.purchaseDate = this.vehicle.purchaseDate;
      this.vehicle.asset.make = this.vehicle.make;
      this.vehicle.asset.model = this.vehicle.model;
      this.vehicle.asset.categoryId = 1;
      this.vehicle.asset.category = {id: 1} as any;
      this.vehicle.asset.entity = 'vehicle';
      this.vehicle.asset.entityId = this.vehicle.id;

      this.assetService.createAsset(this.vehicle.asset)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;};alert('Could not create assets');return e;}))
      .pipe(take(1))
      .subscribe((assetResult:any) => {
        this.vehicle.assetId = assetResult.id;
        this.vehicle.asset.id = assetResult.id;

        this.vehicleService.updateVehicle(this.vehicle)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;};alert('Could not save assets');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.getChildAssets();
        })
      })
    } else {
      this.getChildAssets();
    }

  }

  getChildAssets(){
    if(this.vehicle.asset.categoryId === 1 || this.vehicle.asset.categoryId === 4){
      this.assetService.getAssetsByParent(this.vehicle.assetId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Child Assets');return e;}))
      .pipe(take(1))
      .subscribe((assetList:any) => {
        this.linkedAssets = assetList;
      });
    }
  }

  save() {
    this.vehicle.asset.asset = this.vehicle.registration;
    if(this.vehicle.purchaseDate !== ''){this.vehicle.asset.purchaseDate = this.vehicle.purchaseDate;}
    if(this.vehicle.make !== ''){this.vehicle.asset.make = this.vehicle.make;}
    if(this.vehicle.model !== ''){this.vehicle.asset.model = this.vehicle.model;}
    if(this.vehicle.detail.dateOfFirstRegistration !== ''){this.vehicle.asset.dateOfRegistration = this.vehicle.detail.dateOfFirstRegistration}
    if(this.vehicle.depotId !== -1){
      this.vehicle.asset.depotId = this.vehicle.depotId;
      this.vehicle.asset.depot = {id:this.vehicle.depotId} as any;
    }

    if(this.vehicle.secondaryVehicleTypeId === -1){
      this.vehicle.secondaryVehicleType = {id:-1} as any;
    }

    if(this.vehicle.asset.categoryId === -1){
      this.vehicle.asset.categoryId = 1;
      this.vehicle.asset.category = {id:1} as any;
    }

    this.isError = false;
    this.isServerError = false;
    if(this.vehicleValidator.isValid(this.vehicle)) {
      // try to save it

      this.vehicleDetailService.saveVehicle(this.vehicle.detail)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not update Details');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.assetService.saveAsset(this.vehicle.asset)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}('Could not update Asset');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.vehicleService.updateVehicle(this.vehicle)
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not update Vehicle');return e;}))
          .pipe(take(1))
          .subscribe(() => {

            if(this.inspectionAssignments.intervals.length > 0){
              this.inspectionService.deleteAllAssignmentsForParentId(this.vehicle.detailId)
              .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not remove intervals');return e;}))
              .pipe(take(1))
              .subscribe(() => {
                let newInspections = [];
                this.inspectionAssignments.intervals.forEach(item => {
                    const newAssignment = {
                      vehicleDetailId: this.vehicle.detailId,
                      vehicleInspectionIntervalId: item.id,
                      vehicleInspectionDetails:item
                    }

                    newInspections.push(newAssignment);
                })


                this.inspectionService.addBulkInspectionAssignment(newInspections)
                .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;};alert('Could not add intervals');return e;}))
                .pipe(take(1))
                .subscribe(() => {
                 window.location.href = '/vehicles';
                })
              })
            } else {
             window.location.href = '/vehicles';
            }
          })
        })
      })

    } else {
      this.isError = true;
    }
  }



}
