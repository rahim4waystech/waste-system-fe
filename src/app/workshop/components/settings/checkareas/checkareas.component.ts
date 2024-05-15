import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { VehicleChecksAreas } from 'src/app/workshop/models/vehiclecheckarea.model';
import { VehicleCheckService } from 'src/app/workshop/services/vehiclechecks.service';

@Component({
  selector: 'app-checkareas',
  templateUrl: './checkareas.component.html',
  styleUrls: ['./checkareas.component.scss']
})
export class CheckareasComponent implements OnInit {
  categories: any = [];
  disableButtons: boolean = false;
  vehicleTypes: any = [];
  addToggle:boolean = false;

  newRow = {
    name:'',
    vehicleTypeId:0,
    addToggle: true
  };

  constructor(
    private vehicleCheckService: VehicleCheckService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(){
    this.addToggle = false;
    this.vehicleCheckService.getAllVehicleCheckAreas()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get categories');return e;}))
    .pipe(take(1))
    .subscribe(categories => {
      this.categories = categories;
      this.disableButtons = false;
    })

    this.vehicleService.getAllVehicleTypes()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Vehicle Types');return e}))
    .pipe(take(1))
    .subscribe(vehicleTypes => {
      this.vehicleTypes = vehicleTypes;
    })
  }

  addRow(){
    this.disableButtons = true;
    this.addToggle = true;

    this.newRow = {
      name:'',
      vehicleTypeId:0,
      addToggle: true
    };
  }

  saveRow(){
    if(this.newRow.name !== '' && this.newRow.vehicleTypeId >= 0){
      let newItem = new VehicleChecksAreas();
      newItem.name = this.newRow.name;
      newItem.vehicleTypeId = this.newRow.vehicleTypeId;
      newItem.vehicleType = {id:this.newRow.vehicleTypeId} as any;
      // Create
      this.vehicleCheckService.createVehicleCheckArea(newItem)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Save Area');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.loadContent();
      })
    }

  }

}
