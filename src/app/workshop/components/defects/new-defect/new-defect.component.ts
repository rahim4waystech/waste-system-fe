import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleDetailService } from 'src/app/workshop/services/vehicledetails.service';
import { VehicleDetails } from 'src/app/workshop/models/vehicledetails.model';
import { Defect } from 'src/app/workshop/models/defect.model';
import { VehicleInspectionIntervalService } from 'src/app/workshop/services/vehicleinspections.service';
import { catchError, take } from 'rxjs/operators';
import { DefectService } from 'src/app/workshop/services/defect.service';
import * as moment from 'moment';
import { VehicleVorService } from 'src/app/vehicle/services/vehicle-vor.service';
import {VehicleVOR} from 'src/app/vehicle/models/vehicle-vor.model';
import { InspectionDates } from 'src/app/workshop/models/inspection-dates.model';

@Component({
  selector: 'app-new-defect',
  templateUrl: './new-defect.component.html',
  styleUrls: ['./new-defect.component.scss']
})
export class NewDefectComponent implements OnInit {
  vehicleId: number = -1;
  vehicle: Vehicle = new Vehicle();
  defect: Defect = new Defect();


  constructor(
    private route: ActivatedRoute,
    private router:  Router,
    private vehicleService: VehicleService,
    private vehicleDetailService: VehicleDetailService,
    private inspectionService: VehicleInspectionIntervalService,
    private defectService: DefectService,
    private vorService: VehicleVorService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if(params['id'] !== undefined){
        // this.defect.subcontractor.ownDepot = null;
        this.vehicleId = params['id'];

        this.vehicleService.getVehicleById(this.vehicleId).subscribe((vehicle:Vehicle) => {
          this.vehicle = vehicle;
          this.inspectionService.getAllInspectionAssignmentsByVehicle(this.vehicle.id)
          .pipe(catchError((e) => {if(e.status === 403 || e.status === 401){return e;}alert('Could not recover Inspection Intervals for this vehicle');return e;}))
          .pipe(take(1))
          .subscribe(inspections => {
            this.vehicle.detail.inspectionIntervals = inspections;
          })
        })
      }
    });
  }

  save(){
    let returnedVehicleId = -1;
    if(this.validate()){
      this.defect.inspectionInterval.id = this.defect.vehicleInspectionIntervalsId;
      this.defect.vehicleCheckArea.id = this.defect.vehicleCheckAreaId;
      this.defect.vehicleSeverity.id = this.defect.vehicleSeverityId;
      delete this.defect.id;
      delete this.defect.started;
      delete this.defect.ended;
      delete this.defect.finalSignoff;

      if(this.defect.bookedFor === ''){delete this.defect.bookedFor; alert('removed bookedfor')}

      this.defectService.createDefect(this.defect)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Defect');return e;}))
      .pipe(take(1))
      .subscribe((result:any) => {
        returnedVehicleId = result.id;

        if(this.defect.vehicleInspectionIntervalsId !== -1){
          let newInspectionEntry = new InspectionDates();

          newInspectionEntry.vehicleId = this.vehicle.id;
          newInspectionEntry.vehicle.id = this.vehicle.id;
          newInspectionEntry.inspectionIntervalId = this.defect.vehicleInspectionIntervalsId;
          newInspectionEntry.inspectionInterval.id = this.defect.vehicleInspectionIntervalsId;
          newInspectionEntry.defectId = result.id;
          newInspectionEntry.defect.id = result.id;
          newInspectionEntry.date = moment().format('YYYY-MM-DD');

          this.defectService.addInspectionDate(newInspectionEntry)
          .pipe(take(1))
          .subscribe(() => {
            if(result.vehicleSeverity.isVor){
              let vehicleVor:VehicleVOR = new VehicleVOR();

              vehicleVor.vehicleId = result.vehicleId;
              vehicleVor.vehicle.id = result.vehicleId;
              vehicleVor.startDate = moment().format('YYYY-MM-DD');
              vehicleVor.endDate = moment().format('YYYY-MM-DD');
              vehicleVor.notes = 'AutoVOR: ' + result.description;

              this.vorService.createVehicleVOR(vehicleVor)
              .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not update VOR');return e;}))
              .pipe(take(1))
              .subscribe(() => {
                this.router.navigateByUrl('4workshop/defect/' + returnedVehicleId);
              })
            } else {
              this.router.navigateByUrl('4workshop/defect/' + returnedVehicleId);
            }
          })
        } else {
          if(result.vehicleSeverity.isVor){
            let vehicleVor:VehicleVOR = new VehicleVOR();

            vehicleVor.vehicleId = result.vehicleId;
            vehicleVor.vehicle.id = result.vehicleId;
            vehicleVor.startDate = moment().format('YYYY-MM-DD');
            vehicleVor.endDate = moment().format('YYYY-MM-DD');
            vehicleVor.notes = 'AutoVOR: ' + result.description;

            this.vorService.createVehicleVOR(vehicleVor)
            .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not update VOR');return e;}))
            .pipe(take(1))
            .subscribe(() => {
              this.router.navigateByUrl('4workshop/defect/' + returnedVehicleId);
            })
          } else {
            this.router.navigateByUrl('4workshop/defect/' + returnedVehicleId);
          }
        }
      })
    } else {
      alert('Please fill in all highlighted details')
    }
  }

  cancel(){
    this.router.navigateByUrl('/4workshop/defects')
  }

  validate(){
    let result = true;

    if(this.defect.vehicleId === -1 || this.defect.vehicleId === null || this.defect.vehicleId === undefined){
      result = false;
    }
    if(this.defect.vehicleCheckAreaId === -1 || this.defect.vehicleCheckAreaId === null || this.defect.vehicleCheckAreaId === undefined){
      result = false;
    }
    if(this.defect.vehicleSeverityId === -1 || this.defect.vehicleSeverityId === null || this.defect.vehicleSeverityId === undefined){
      result = false;
    }
    if(this.defect.description === '' || this.defect.description.length === 0 || this.defect.description === null || this.defect.description === undefined){
      result = false;
    }

    if(this.defect.depotId === -1 || this.defect.depotId === null || this.defect.depotId === undefined){
      if(this.defect.workshopSubcontractorsId === -1 || this.defect.workshopSubcontractorsId === null || this.defect.workshopSubcontractorsId === undefined){
        result = false;
      }
    }

    return result;
  }
}
