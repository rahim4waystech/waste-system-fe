import { Component, OnInit } from '@angular/core';
import { VehicleDetails } from 'src/app/workshop/models/vehicledetails.model';
import { VehicleDetailService } from 'src/app/workshop/services/vehicledetails.service';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, take } from 'rxjs/operators';
import * as moment from 'moment';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { DefectService } from 'src/app/workshop/services/defect.service';
import { VehicleInspectionIntervalService } from 'src/app/workshop/services/vehicleinspections.service';
import { VehicleCheckService } from 'src/app/workshop/services/vehiclechecks.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';

@Component({
  selector: 'app-vehicle-view',
  templateUrl: './vehicle-view.component.html',
  styleUrls: ['./vehicle-view.component.scss']
})
export class VehicleViewComponent implements OnInit {
  vehicle: any = {};
  vehicleId:number = -1;

  recentDrivers = [
    {id:3,firstName:'Gerald',lastName:'Tart',employeeNumber:'RWM-3',date:'2020-11-27'},
    {id:3,firstName:'Gerald',lastName:'Tart',employeeNumber:'RWM-3',date:'2020-11-26'},
    {id:2,firstName:'Brian',lastName:'Onions',employeeNumber:'RWM-2',date:'2020-11-25'},
    {id:3,firstName:'Gerald',lastName:'Tart',employeeNumber:'RWM-3',date:'2020-11-24'},
    {id:3,firstName:'Gerald',lastName:'Tart',employeeNumber:'RWM-3',date:'2020-11-23'},
  ];

  recentDefects: any = [];

  recentVehicleChecks: any = [];

  dueDates: any = [];

  defectButtons: GridButton[] = [
    {label: 'View', link: '4workshop/defect/:id', type: 'btn-success',} as GridButton
  ]
  defectColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Last Updated', field: 'updatedAt', value:(v,r) => !r.updatedAt ? 'N/A' : moment(r.updatedAt).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Severity', field: 'vehicleSeverity.notes'} as GridColumn,
    {active: true, label: 'Depot', field: 'depotId'} as GridColumn,
    {active: true, label: 'Area', field: 'vehicleCheckArea.name'} as GridColumn,
    {active: true, label: 'Status', field: 'vehicleId', value:(v, r) => this.getStatus(r)} as GridColumn,
  ];

  // Org filter handled at API level
  defectFilters: GridFilter[] = []

  defectSearchFields: any = ['description','updatedAt','vehicleCheckArea.name','vehicleSeverity.notes'];

  defectSearchFilters: GridSearchFilter[] = [
    {field: 'description',label: 'Description',} as GridSearchFilter,
    {field: 'updatedAt',label: 'Last Updated',} as GridSearchFilter,
    {field: 'vehicleCheckArea.name',label: 'Area',} as GridSearchFilter,
    {field: 'vehicleSeverity.notes',label: 'Severity',} as GridSearchFilter,
  ]

  constructor(
    private vehicleDetailService: VehicleDetailService,
    private vehicleService: VehicleService,
    private vehicleCheckService:VehicleCheckService,
    private defectService: DefectService,
    private route:ActivatedRoute,
    private router:Router,
    private driverService:DriverService,
    private inspectionService: VehicleInspectionIntervalService
  ) { }

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(){
    const recentDefectLimit = 5;

    this.route.params.subscribe((params) => {
      this.vehicleId = params['id'];

      this.defectFilters = [{field: 'vehicleId',condition: 'eq',value: params['id'],}];

      this.vehicleService.getVehicleById(params['id']).subscribe(data => {
        this.vehicle = data;

        this.vehicleCheckService.getDriverChecksByVehicleId(this.vehicle.id)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}('Could not retrieve Vehicle Checks');return e;}))
        .pipe(take(1))
        .subscribe((data:any) => {
          data.forEach(item => {
            this.vehicleCheckService.getDriverChecksByGroupId(item.id)
            .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Vehicle Checks');return e;}))
            .pipe(take(1))
            .subscribe((allChecks:any) => {
              const pass = allChecks.filter(f=>f.result === true);
              const fail = allChecks.filter(f=>f.result === false);

              this.driverService.getDriverById(item.driverId)
              .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Vehicle Checks');return e;}))
              .pipe(take(1))
              .subscribe(driver => {
                const check = {
                  id:item.id,
                  dateTime:moment(item.createdAt).format('DD/MM/YYYY HH:mm'),
                  passed: pass.length,
                  failed: fail.length,
                  driver: driver
                }
                this.recentVehicleChecks.push(check);
              })
            })
          })
        })


        this.defectService.getDefectsByVehicleId(this.vehicleId,recentDefectLimit)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not recover recent defects');return e;}))
        .pipe(take(1))
        .subscribe(defects => {
          this.recentDefects = defects;

          this.recentDefects.forEach(item => {
            if(item.started === null){
              item.status = 1;
              // not started - danger
            }
            if(item.started !== null && item.ended === null){
              item.status =  2
              // in progress - warning
            }
            if(item.started !== null && item.ended !== null && item.finalSignOff !== null){
              item.status =  3
              // done - success
            }
            if(item.finalSignOff !== null) {
              item.finalSignOff = 'n/a';
            }
          })
        })

        this.inspectionService.getAllInspectionAssignmentsByVehicle(this.vehicle.detailId)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Intervals');return e;}))
        .pipe(take(1))
        .subscribe((intervals:any) => {
          intervals.forEach(interval => {
            this.inspectionService.getLastInspectionByVehicleIdAndIntervalId(this.vehicle.id,interval.vehicleInspectionIntervalId)
            .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get last inspections');return e;}))
            .pipe(take(1))
            .subscribe((date:any) => {
              let newDate = date[0];

              newDate.nextDate = moment(newDate.date,'YYYY-MM-DD').add(newDate.inspectionInterval.number,newDate.inspectionInterval.unitAbbrev);
              newDate.nextDateFancy = moment(newDate.nextDate,'YYYY-MM-DD').format('DD/MM/YYYY');
              newDate.date = moment(newDate.date,'YYYY-MM-DD');
              newDate.dateFancy = moment(newDate.date,'YYYY-MM-DD').format('DD/MM/YYYY');

              newDate.nextColour = 0;

              if(newDate.nextDate <  moment()){
                newDate.nextColour = 0;
              } else if(newDate.nextDate <= moment().add(1,'w') && newDate.nextDate >= moment()){
                newDate.nextColour = 1;
              } else {
                newDate.nextColour = 2;
              }

              this.dueDates.push(date[0]);
            })
          })
        })
      })
    })
  }

  formatDatetime(dateTime){
    if(dateTime === '' || dateTime === null || dateTime === undefined){
      return 'n/a';
    } else {
      return moment(dateTime).format('DD/MM/YY @ HHmm');
    }
  }

  formatDate(date){
    if(date === '' || date === null || date === undefined){
      return 'n/a';
    } else {
      return moment(date).format('DD/MM/YY');
    }
  }

  openLinkInNewTab(link:string) {
    // Converts the route into a string that can be used
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${link}`])
    );

    window.open(url, '_blank');
  }

  saveVehicle(){
    if(this.validateVehicle(this.vehicle)){
      this.vehicleService.updateVehicle(this.vehicle)
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('Could not Save Vehicle');
        return e;
      }))
      .pipe(take(1))
      .subscribe(() => {
        this.vehicleDetailService.saveVehicle(this.vehicle)
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401){return e;}
          alert('Could not Save Vehicle Details');
          return e;
        }))
        .pipe(take(1))
        .subscribe(() => {
          this.loadContent();
        });
      });
    } else {
      alert('Please fill in marked details')
    }

  }

  cancelVehicle(){
    if(confirm('Exit without saving?')){
      this.router.navigateByUrl('4workshop/vehicles')
    }
  }

  validateVehicle(vehicle){
    let result = true;


    if(vehicle.registration === '' || vehicle.registration === ' ' || vehicle.registration.length < 1){
      result = false;
    }
    if(vehicle.vinNumber === '' || vehicle.vinNumber === ' ' || vehicle.vinNumber.length < 1){
      result = false;
    }

    if(vehicle.vehicleTypeId === -1){result = false;}
    // if(vehicle.fuelTypeId === -1){result = false;}
    if(vehicle.tareWeight <= 0){result = false;}

    return result;
  }

  getStatus(r){
    if(r.started === null){
      return 'Not Started';
    } else if(r.started !== null && r.ended === null){
      return 'In Progress'
    } else if(r.started !== null && r.ended !== null && r.finalSignoff === null){
      return 'Finished(unsigned)'
    } else if(r.finalSignoff !== null){
      return 'Finished'
    } else {
      return 'Could not get status'
    }
  }

}
