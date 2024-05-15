import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { VehicleCheckService } from 'src/app/workshop/services/vehiclechecks.service';
import { VehicleChecks } from 'src/app/workshop/models/vehiclechecks.model';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-checks',
  templateUrl: './driver-checks.component.html',
  styleUrls: ['./driver-checks.component.scss']
})
export class DriverChecksComponent implements OnInit {
  disableButtons = false;
  vehicleTypes: any = [];
  checkAreas: any = [];
  severities: any = [];

  newCheck: VehicleChecks = new VehicleChecks();

  vehicleChecks = [
    {vehicleTypeId: 0, name: 'All Vehicles',checks:[],addToggle:false}
  ];

  constructor(
    private vehicleService:VehicleService,
    private vehicleCheckService: VehicleCheckService
  ) { }

  ngOnInit(): void {
    this.vehicleCheckService.getAllVehicleCheckAreas().subscribe(checkAreas => {
      this.checkAreas = checkAreas;
    })
    this.vehicleCheckService.getAllVehicleSeverities().subscribe(severities => {
      this.severities = severities;
    })

    this.vehicleService.getAllVehicleTypes().subscribe(vehicleTypes => {
      this.vehicleTypes = vehicleTypes;

      this.vehicleTypes.forEach(type => {
        const typeObj = {vehicleTypeId: type.id, name: type.name,checks:[],addToggle:false}
        this.vehicleChecks.push(typeObj);
      })

      this.vehicleCheckService.getAllDriverChecks().subscribe((allChecks:any) => {
        allChecks.forEach(check => {
          check.editing = false;
        })

        this.vehicleChecks.forEach(vehicleType => {
          vehicleType.checks = allChecks.filter(f=>f.vehicleTypeId === vehicleType.vehicleTypeId)
        })
      })
    })
  }

  addRow(vehicleTypeId:number){
    this.disableButtons = true;
    this.newCheck = new VehicleChecks();
    delete this.newCheck.id;

    for(let i=0;i<this.vehicleChecks.length;i++){
      if (this.vehicleChecks[i].vehicleTypeId === vehicleTypeId){
        this.vehicleChecks[i].addToggle = true;
      }
    }
  }

  changeVehicleArea(event){
    this.newCheck.vehicleCheckAreaId = parseInt(event.target.value);
  }

  changeVehicleSeverity(event){
    this.newCheck.severity = parseInt(event.target.value);
  }

  saveCheck(vehicleTypeId:number){
    this.newCheck.vehicleTypeId = vehicleTypeId;
    if(this.newCheck.severity === -1 || this.newCheck.vehicleCheckAreaId === -1){
      alert('Please check you have added a Severity and Vehicle Area.')
    } else {
      delete this.newCheck.createdAt;
      delete this.newCheck.updatedAt;
      this.vehicleCheckService.createVehicle(this.newCheck).subscribe(() => {
        this.cancelCheck(vehicleTypeId)

        for(let i=0;i<this.vehicleChecks.length;i++){
          if (this.vehicleChecks[i].vehicleTypeId === vehicleTypeId){
            this.vehicleChecks[i].checks.push(this.newCheck);
          }
        }
      })
    }
  }

  updateCheck(check){
    delete check.updating;
    this.vehicleCheckService.saveCheck(check).subscribe(() => {
      this.cancelEditCheck(check.vehicleTypeId,check.id);
    })
  }

  cancelCheck(vehicleTypeId:number){
    for(let i=0;i<this.vehicleChecks.length;i++){
      if (this.vehicleChecks[i].vehicleTypeId === vehicleTypeId){
        this.vehicleChecks[i].addToggle = false;
      }
    }
    this.disableButtons = false;
  }

  cancelAllCheck(){
    this.vehicleChecks.forEach(item => {
      item.addToggle = false;
    })
    this.disableButtons = false;
  }

  getSeverity(id:number){
    const severity = this.severities.filter(f=>f.severity === id)[0];
    let result = severity.severity;
    if(severity.notes !== null && severity.notes !== ''){
      result += ' (' + severity.notes + ')';
    }
    return result;
  }

  getArea(id:number){
    const area = this.checkAreas.filter(f=>f.id === id)[0];
    return area.name;
  }

  parseBoolean(bool){
    if(bool){return'Yes'} else{return'No'}
  }

  editCheck(vehicleType:number,id:number){
    for(let i=0;i<this.vehicleChecks.length;i++){
      if (this.vehicleChecks[i].vehicleTypeId === vehicleType){
        for(let x=0;x<this.vehicleChecks[i].checks.length;x++){
          if(this.vehicleChecks[i].checks[x].id === id){
            this.vehicleChecks[i].checks[x].editing = true;
          }
        }
      ;
      }
    }
  }

  cancelEditCheck(vehicleType:number,id:number){
    for(let i=0;i<this.vehicleChecks.length;i++){
      if (this.vehicleChecks[i].vehicleTypeId === vehicleType){
        for(let x=0;x<this.vehicleChecks[i].checks.length;x++){
          if(this.vehicleChecks[i].checks[x].id === id){
            this.vehicleChecks[i].checks[x].editing = false;
          }
        }
      ;
      }
    }
  }

}
