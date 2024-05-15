import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleType } from 'src/app/vehicle/models/vehicle-type.model';
import { FuelType } from 'src/app/vehicle/models/fuel-type.model';
import { environment } from 'src/environments/environment';
import { VehicleDetails } from 'src/app/workshop/models/vehicledetails.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { VehicleInspectionIntervalService } from 'src/app/workshop/services/vehicleinspections.service';
import { Account } from 'src/app/order/models/account.model';
import { InspectionDates } from 'src/app/workshop/models/inspection-dates.model';
import { DefectService } from 'src/app/workshop/services/defect.service';
import * as moment from 'moment';

@Component({
  selector: 'app-vehicledetail-form',
  templateUrl: './vehicledetail-form.component.html',
  styleUrls: ['./vehicledetail-form.component.scss']
})
export class VehicledetailFormComponent implements OnInit {
  @Input()
  vehicleDetails: VehicleDetails = new VehicleDetails();
  @Input()
  vehicle: Vehicle = new Vehicle();

  @Input()
  inspectionAssignments: any = {intervals:[]};

  @Input()
  edit: boolean = true;

  newDate: string = '';

  types: VehicleType[] = [];
  fuelTypes: FuelType[] = [];
  inspectionIntervals: any = [];
  assignedIntervals: any = [];

  depots: Account[] = [];
  vehicleWeightUnit:string= '';
  editToggle:Boolean = false;
  addIntervalToggle:Boolean = false;

  tempVehicleType = '';
  tempFuelType = '';
  tempDepot = '';

  constructor(
    private vehicleService: VehicleService,
    private accountService: AccountService,
    private inspectionService: VehicleInspectionIntervalService,
    private defectService:DefectService
  ) { }

  ngOnInit(): void {
    if(!this.edit){
      this.editToggle = true;
    }

    this.vehicleWeightUnit = environment.defaults.tareWeightUnit;

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

  ngOnChanges(changes: SimpleChanges){
    if(changes.vehicleDetails !== undefined){
      if(changes.vehicleDetails.currentValue.id !== -1){
        this.inspectionService.getAllInspectionAssignmentsByVehicle(this.vehicleDetails.id)
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401){return e;}
          alert('Assigned Inspections could not be loaded');
          return e;
        }))
        .pipe(take(1))
        .subscribe((assignments: any) => {
          this.assignedIntervals = assignments;
          assignments.forEach(item => {
            this.inspectionService.getInspectionIntervalById(item.vehicleInspectionIntervalId)
            .pipe(catchError((e) => {
              if(e.status === 403 || e.status === 401){return e;}
              alert('Inspection Assignments Failed to retrieve');
              return e;
            }))
            .pipe(take(1))
            .subscribe((intervals: any) => {
              // CAUTION: LOAD BEARING CODE STUB
      //        this.inspectionAssignments.intervals.push(intervals[0]);
            });
          })
        });
      }
    }
  }

  deleteInspectionAssignment(id:number){
    const tempInspections = this.inspectionAssignments.intervals;
    this.inspectionAssignments.intervals = [];
    this.inspectionAssignments.intervals = tempInspections.filter(f=>f.id !== id);
  }

  addInterval(event){
    if(this.inspectionAssignments.intervals === undefined){
      this.inspectionAssignments.intervals = [];
    }
    let newInterval = this.inspectionIntervals.filter(f=>f.id === parseInt(event.target.value,10))[0];

    this.inspectionService.getLastInspectionByVehicleIdAndIntervalId(this.vehicle.id,newInterval.id)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get last inspections');return e;}))
    .pipe(take(1))
    .subscribe((lastDate:any) => {
      if(lastDate.length > 0){
        newInterval.lastDate = lastDate[0].date;
      } else {
        newInterval.lastDate = '';
      }


      this.inspectionAssignments.intervals.push(newInterval);
      this.addIntervalToggle = false;
    })


  }

  addDateToInspection(inspection){
    if(inspection.lastDate === ''){
      if(confirm('Add Interval without previous date?')) { }
    } else {
      // this.inspectionAssignments.intervals.forEach(interval => {
      //   if(interval.id === inspectionId){
      //     interval.lastDate = this.newDate;
      //   }
      // })
      //
      let newInspectionDate = new InspectionDates();

      newInspectionDate.inspectionIntervalId = inspection.id;
      newInspectionDate.inspectionInterval.id = inspection.id;
      newInspectionDate.vehicleId = this.vehicle.id;
      newInspectionDate.vehicle.id = this.vehicle.id;
      newInspectionDate.date = inspection.lastDate;
      newInspectionDate.defectId = -1;


      this.defectService.addInspectionDate(newInspectionDate)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save inspection Date');return e;}))
      .pipe(take(1))
      .subscribe(()=>{
        this.newDate = '';
        alert('Date added. Please save Vehicle to complete.')
      })
    }
  }

  alreadySelected(id:number){
    if(this.inspectionAssignments.intervals === undefined){
      this.inspectionAssignments.intervals = [];
    }

    let countInstances = this.inspectionAssignments.intervals.filter(f=>f.id === id);

    if(countInstances.length === 0){
      return false;
    } else {
      return true;
    }
  }

  niceDate(date){
    return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  nextDate(inspection){
    return moment(inspection.lastDate,'YYYY-MM-DD').add(inspection.number,inspection.unitAbbrev).format('DD/MM/YYYY');
  }
}
