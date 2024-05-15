import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { VehicleSeverity } from 'src/app/workshop/models/vehicleseverity.model';
import { VehicleCheckService } from 'src/app/workshop/services/vehiclechecks.service';

@Component({
  selector: 'app-severities',
  templateUrl: './severities.component.html',
  styleUrls: ['./severities.component.scss']
})
export class SeveritiesComponent implements OnInit {
  severities: any = [];
  disableButtons:boolean = false;
  addRow:boolean = false;
  newRow:VehicleSeverity = new VehicleSeverity();

  constructor(
    private vehicleCheckService: VehicleCheckService
  ) { }

  ngOnInit(): void {
    this.disableButtons = true;
    this.loadContent();
  }

  loadContent(){
    this.disableButtons = true;
    this.addRow = false;
    this.vehicleCheckService.getAllVehicleSeverities()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Severity levels');return e;}))
    .pipe(take(1))
    .subscribe((severities: any) => {
      this.severities = severities;
        this.disableButtons = false;
    })
  }

  moveUp(severityLvl:number){
    this.disableButtons = true;
    let currentSeverity = 0;
    let oldSeverity = 0;
    for(let i=0;i<this.severities.length;i++){
      if(this.severities[i].severity === severityLvl){
        currentSeverity = i;
      }
      if(this.severities[i].severity === severityLvl -1){
        oldSeverity = i;
      }
    }

    this.severities[currentSeverity].severity--;
    this.severities[oldSeverity].severity++;

    this.vehicleCheckService.updateSeverity(this.severities[currentSeverity])
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Level Change');return e;}))
    .pipe(take(1))
    .subscribe(() => {
      this.vehicleCheckService.updateSeverity(this.severities[oldSeverity])
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Level Change');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.loadContent()
      })
    })
  }

  moveDown(severityLvl:number){
    this.disableButtons = true;
    let currentSeverity = 0;
    let oldSeverity = 0;
    for(let i=0;i<this.severities.length;i++){
      if(this.severities[i].severity === severityLvl){
        currentSeverity = i;
      }
      if(this.severities[i].severity === severityLvl +1){
        oldSeverity = i;
      }
    }

    this.severities[currentSeverity].severity++;
    this.severities[oldSeverity].severity--;

    this.vehicleCheckService.updateSeverity(this.severities[currentSeverity])
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Level Change');return e;}))
    .pipe(take(1))
    .subscribe(() => {
      this.vehicleCheckService.updateSeverity(this.severities[oldSeverity])
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Level Change');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.loadContent()
      })
    })
  }

  addNewRow(){
    this.disableButtons = true;
    this.newRow = new VehicleSeverity();
    this.newRow.severity = this.severities.length + 1;
    this.addRow = true;
      this.disableButtons = false;
  }

  save(){
    this.disableButtons = true;
    if(this.newRow.notes !== ''){
      this.vehicleCheckService.addSeverity(this.newRow)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Severity');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.loadContent();
      })
    } else {
      alert('Please complete fields');
        this.disableButtons = false;
    }
  }

  cancel(){
    this.addRow = false;
  }

  changeDropdown(event){
    if(event.target.value === "1"){
      this.newRow.isVor = true;
    } else {
      this.newRow.isVor = false;
    }
  }

}
