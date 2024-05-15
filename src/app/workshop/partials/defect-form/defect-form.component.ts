import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Defect } from '../../models/defect.model';
import { VehicleDetails } from '../../models/vehicledetails.model';
import { environment } from 'src/environments/environment';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { VehicleCheckService } from '../../services/vehiclechecks.service';
import { catchError, take } from 'rxjs/operators';
import { VehicleInspectionIntervalService } from '../../services/vehicleinspections.service';
import { WorkshopSubcontractorsService } from '../../services/workshop-subcontractors.service';
import { VehicleDetailService } from '../../services/vehicledetails.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { AccountService } from 'src/app/account/services/account.service';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-defect-form',
  templateUrl: './defect-form.component.html',
  styleUrls: ['./defect-form.component.scss']
})
export class DefectFormComponent implements OnInit, OnChanges {
  @Input()
  defect: Defect = new Defect();

  @Input()
  vehicle: Vehicle = new Vehicle();

  @Input()
  editToggle:Boolean = true;

  isSubcontractor:number = -1;
  subcontractorId:number= -1;

  checkAreas: any = [];
  severities: any = [];
  inspections: any = [];
  subcontractors:any = [];
  subcontractorDepots:any = [];
  companyName: string = '';
  ownDepots:any = [];

  vehicleType: number = -1;
  vehicleTypes: any = [];
  vehicles: any = [];
  showVehicles:boolean = false;
  showDefectForm:boolean = false;

  tempVehicleType = '';
  tempVehicle = '';
  tempCheckArea = '';
  tempSeverity = '';
  tempInspection = '';
  tempSubbieToggle = '';
  tempSubcontractor = '';
  tempSubcontractorDepot = '';


  constructor(
    private vehicleCheckService:VehicleCheckService,
    private inspectionService:VehicleInspectionIntervalService,
    private workshopSubcontractorService:WorkshopSubcontractorsService,
    private vehicleService: VehicleService,
    private accountService: AccountService,
    private subcontractorService: SubcontractorService
  ) { }

  ngOnInit(): void {
    this.companyName = environment.defaults.companyName;

    this.vehicleCheckService.getAllVehicleCheckAreas()
    .pipe(catchError((e) => {if(e.status === 403 || e.status === 401){return e;}alert('Vehicle Check Areas could not be loaded');return e;}))
    .pipe(take(1))
    .subscribe(checkAreas => {this.checkAreas = checkAreas;})

    this.vehicleCheckService.getAllVehicleSeverities()
    .pipe(catchError((e) => {if(e.status === 403 || e.status === 401){return e;}alert('Vehicle Severities could not be loaded');return e;}))
    .pipe(take(1))
    .subscribe(severities => {this.severities = severities;})

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
      this.ownDepots = depots;
    });

    this.vehicleService.getAllVehicleTypes()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Vehicle Types');return e}))
    .pipe(take(1))
    .subscribe(vehicleTypes => {
      this.vehicleTypes = vehicleTypes;

      if(this.vehicle.id !== -1){
        this.defect.vehicleId = this.vehicle.id;
        this.defect.vehicle.id = this.vehicle.id;
        this.defect.vehicle.vehicleTypeId = this.vehicle.vehicleTypeId
      }

      if(this.defect.vehicle !== undefined){
        this.vehicleType = this.defect.vehicle.vehicleTypeId
        let tempTempVehicleType = this.vehicleTypes.filter(f=>f.id === this.vehicleType)[0];
        if(tempTempVehicleType !== undefined){
          this.tempVehicleType = tempTempVehicleType.name;
        }
        if(this.vehicleType !== -1){
          this.showVehicles = true;
          this.getVehiclesByType();
          this.showDefectForm = true;
        }

        this.tempVehicle = this.defect.vehicle.registration;
        this.tempCheckArea = this.defect.vehicleCheckArea.name;
        this.tempSeverity = this.defect.vehicleSeverity.severity + ' (' + this.defect.vehicleSeverity.notes + ')';

        this.subcontractorService.getAllSubcontractors()
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Subcontractors could not be loaded');
          return e;
        }))
        .pipe(take(1))
        .subscribe((subbie: Subcontractor[]) => {
          this.subcontractors = subbie;

          if(this.defect.vehicleInspectionIntervalsId > 0){
            this.tempInspection = this.defect.inspectionInterval.name + ' ('+this.defect.inspectionInterval.number+' '+this.defect.inspectionInterval.unit+')';
          } else {
            this.tempInspection = 'n/a';
          }
          if((this.defect.depotId === -1 || this.defect.depotId === null) && this.defect.workshopSubcontractorsId !== -1){
            this.tempSubbieToggle = 'Subcontractor';
            this.isSubcontractor = 1;
            this.subcontractorId = this.defect.subcontractor.id
            if(this.defect.subcontractor.parentId === -1 || this.defect.subcontractor.parentId === null){
              this.tempSubcontractor = this.defect.subcontractor.name;
              this.tempSubcontractorDepot = this.defect.subcontractor.name + ' - ' + this.defect.subcontractor.contactCity;
            } else {
              this.tempSubcontractor = this.subcontractors.filter(f=>f.id===this.defect.subcontractor.parentId)[0].name;
              this.tempSubcontractorDepot = this.defect.subcontractor.name + ' - ' + this.defect.subcontractor.contactCity;
            }

          } else if(this.defect.depotId > 0) {
            this.tempSubbieToggle = 'In-House';
            this.isSubcontractor = 0;
            this.tempSubcontractorDepot = this.defect.depot.name;
          }
        });
      }
    })
  }

  ngOnChanges(changes: SimpleChanges){

    // Load inspection int3ervals after vehicles has loaded
    if(changes.vehicle) {
      if(changes.vehicle.currentValue.id !== -1) {
        this.inspectionService.getAllInspectionAssignmentsByVehicle(this.vehicle.detailId)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Inspections');return e;}))
        .pipe(take(1))
        .subscribe(inspections => {
          this.inspections = inspections;

          this.vehicleType = this.vehicle.vehicleTypeId;
          this.getVehiclesByType();
        })
      }
    }

    if(changes.defect) {
      if(changes.defect.currentValue.id !== -1){
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
          this.ownDepots = depots;
        });

        this.vehicleService.getAllVehicleTypes()
        .pipe(catchError((e)=>{alert('Could not get Vehicle Types');return e}))
        .pipe(take(1))
        .subscribe(vehicleTypes => {
          this.vehicleTypes = vehicleTypes;

          if(this.vehicle.id !== -1){
            this.defect.vehicleId = this.vehicle.id;
            this.defect.vehicle.id = this.vehicle.id;
            this.defect.vehicle.vehicleTypeId = this.vehicle.vehicleTypeId
          }

          if(this.defect.vehicle !== undefined){
            this.vehicleType = this.defect.vehicle.vehicleTypeId
            this.tempVehicleType = this.vehicleTypes.filter(f=>f.id === this.vehicleType)[0].name;
            if(this.vehicleType !== -1){
              this.showVehicles = true;
              this.getVehiclesByType();
              this.showDefectForm = true;
            }

            this.tempVehicle = this.defect.vehicle.registration;
            this.tempCheckArea = this.defect.vehicleCheckArea.name;
            this.tempSeverity = this.defect.vehicleSeverity.severity + ' (' + this.defect.vehicleSeverity.notes + ')';

            this.subcontractorService.getAllSubcontractors()
            .pipe(catchError((e) => {
              if(e.status === 403 || e.status === 401) {
                return e;
              }
              alert('Subcontractors could not be loaded');
              return e;
            }))
            .pipe(take(1))
            .subscribe((subbie: Subcontractor[]) => {
              this.subcontractors = subbie;

              if(this.defect.vehicleInspectionIntervalsId > 0){
                this.tempInspection = this.defect.inspectionInterval.name + ' ('+this.defect.inspectionInterval.number+' '+this.defect.inspectionInterval.unit+')';
              } else {
                this.tempInspection = 'n/a';
              }
              if((this.defect.depotId === -1 || this.defect.depotId === null) && this.defect.workshopSubcontractorsId !== -1){
                this.tempSubbieToggle = 'Subcontractor';
                this.isSubcontractor = 1;
                this.subcontractorId = this.defect.subcontractor.id
                if(this.defect.subcontractor.parentId === -1 || this.defect.subcontractor.parentId === null){
                  this.tempSubcontractor = this.defect.subcontractor.name;
                  this.tempSubcontractorDepot = this.defect.subcontractor.name + ' - ' + this.defect.subcontractor.contactCity;
                } else {
                  this.tempSubcontractor = this.subcontractors.filter(f=>f.id===this.defect.subcontractor.parentId)[0].name;
                  this.tempSubcontractorDepot = this.defect.subcontractor.name + ' - ' + this.defect.subcontractor.contactCity;
                }

              } else if(this.defect.depotId > 0) {
                this.tempSubbieToggle = 'In-House';
                this.isSubcontractor = 0;
                this.tempSubcontractorDepot = this.defect.depot.name;
              }
            });
          }
        })
      }
    }
  }



  changeSeverity(event){
    this.defect.vehicleSeverityId = parseInt(event.target.value,10);
  }

  changeVehicleType(event){
    this.vehicles = [];
    this.showVehicles = false;
    this.showDefectForm = false;
    this.vehicleType = parseInt(event.target.value);

    this.getVehiclesByType();
  };

  getVehiclesByType(){
    this.vehicleService.getAllVehiclesByType(this.vehicleType)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Vehicles');return e}))
    .pipe(take(1))
    .subscribe(vehicles => {
      this.vehicles = vehicles;
      this.showVehicles = true;
    })
  }

  changeVehicle(event){
    this.defect.vehicleId = parseInt(event.target.value,10);
    this.defect.vehicle.id = parseInt(event.target.value,10);

    this.vehicleService.getVehicleById(this.defect.vehicleId)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Vehicles');return e}))
    .pipe(take(1))
    .subscribe((vehicle:Vehicle) => {
      this.vehicle = vehicle;

      this.inspectionService.getAllInspectionAssignmentsByVehicle(this.vehicle.detailId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Inspections');return e;}))
      .pipe(take(1))
      .subscribe(inspections => {
        this.inspections = inspections;
      })
    })

    this.showDefectForm = true;
  };

  changeVehicleCheckArea(event){
    this.defect.vehicleCheckAreaId = parseInt(event.target.value)
  };

  changeInspection(event){
    this.defect.vehicleInspectionIntervalsId = parseInt(event.target.value)
  };

  changeTarget(event){
    this.subcontractorId = -1;
    this.defect.depotId = -1
    this.defect.depot = new Account();
    this.defect.workshopSubcontractorsId = -1;
    this.defect.subcontractor = new Subcontractor();
    this.isSubcontractor = parseInt(event.target.value,10);
  }

  changeSubcontractor(event){
    this.subcontractorDepots = [];
    this.subcontractorId = parseInt(event.target.value,10);

    this.subcontractorService.getAllSubcontractorsDepots(this.subcontractorId)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Depots');return e;}))
    .pipe(take(1))
    .subscribe(subcontractorDepots =>{
      this.subcontractorDepots = subcontractorDepots;
    })
  }

  changeSubcontractorDepot(event){
    const depotId = parseInt(event.target.value,10);

    if(this.isSubcontractor === 0){
      // Inhouse
      this.defect.depotId = depotId
      this.defect.depot.id = depotId
    } else if(this.isSubcontractor === 1){
      // subbie
      this.defect.workshopSubcontractorsId = depotId;
      this.defect.subcontractor.id = depotId;
    }
  }

}
