import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { VehicleInspectionIntervals } from 'src/app/workshop/models/vehicleinspectionintervals.model';
import { VehicleInspectionIntervalService } from 'src/app/workshop/services/vehicleinspections.service';

@Component({
  selector: 'app-intervals',
  templateUrl: './intervals.component.html',
  styleUrls: ['./intervals.component.scss']
})
export class IntervalsComponent implements OnInit {
  timeUnits = [
    {name:'Day'},
    {name:'Week'},
    {name:'Month'},
    {name:'Year'},
  ];

  newRow = {
    name:'',
    number:0,
    unit: 'Day',
    unitAbbrev: '',
    entity: 'vehicle',
    colour: ''
  };
  intervals: any = [];
  addRow:boolean = false;

  constructor(
    private intervalService: VehicleInspectionIntervalService
  ) { }

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(){
    this.addRow = false;

    this.newRow = {
      name:'',
      number:0,
      unit: 'Day',
      unitAbbrev: '',
      entity: 'vehicle',
      colour: ''
    };

    this.intervalService.getAllInspectionIntervals()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Intervals');return e;}))
    .pipe(take(1))
    .subscribe((intervals) => {
      this.intervals = intervals;
    })
  }

  addNewRow(){
    this.newRow = {
      name:'',
      number:0,
      unit: 'Day',
      unitAbbrev: '',
      entity: 'vehicle',
      colour: ''
    };
    this.addRow = true;
  }

  saveRow(){
    let intervalObj = new VehicleInspectionIntervals();
    if(this.validate()){

      switch(this.newRow.unit){
        case 'Day': intervalObj.unitAbbrev = 'd';break;
        case 'Week': intervalObj.unitAbbrev = 'w';break;
        case 'Month': intervalObj.unitAbbrev = 'm';break;
        case 'Year': intervalObj.unitAbbrev = 'y';break;
      }

      intervalObj.name = this.newRow.name;
      intervalObj.number = this.newRow.number;
      intervalObj.unit = this.newRow.unit;
      intervalObj.entity = this.newRow.entity;

      if(this.newRow.colour === ''){intervalObj.colour = "#FFFFFF"}else{intervalObj.colour = this.newRow.colour}

      this.intervalService.addInspectionInterval(intervalObj)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Intervals');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.loadContent();
      })

    } else {
      alert('Please fill in all marked boxes')
    }
  }

  validate(){
    let result = true;

    if(this.newRow.name === ''){result=false;}
    if(this.newRow.number <= 0){result=false;}
    if(this.newRow.unit === ''){result=false;}
    if(this.newRow.name === ''){result=false;}

    return result;
  }

}
