import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-vehicle-utilisation-graph',
  templateUrl: './vehicle-utilisation-graph.component.html',
  styleUrls: ['./vehicle-utilisation-graph.component.scss']
})
export class VehicleUtilisationGraphComponent implements OnInit {
  dataLine = [
    {
      "name": "Working",
      "series": [
        {"name": moment().format('DD/MM'),"value": 34},
        {"name": moment().add(1,'d').format('DD/MM'),"value": 35},
        {"name": moment().add(2,'d').format('DD/MM'),"value": 23},
        {"name": moment().add(3,'d').format('DD/MM'),"value": 48},
        {"name": moment().add(4,'d').format('DD/MM'),"value": 26},
      ]
    },
    {
      "name": "No Work",
      "series": [
        {"name": moment().format('DD/MM'),"value": 16},
        {"name": moment().add(1,'d').format('DD/MM'),"value": 12},
        {"name": moment().add(2,'d').format('DD/MM'),"value": 25},
        {"name": moment().add(3,'d').format('DD/MM'),"value": 0},
        {"name": moment().add(4,'d').format('DD/MM'),"value": 24},
      ]
    },
    {
      "name": "VOR",
      "series": [
        {"name": moment().format('DD/MM'),"value": 0},
        {"name": moment().add(1,'d').format('DD/MM'),"value": 3},
        {"name": moment().add(2,'d').format('DD/MM'),"value": 2},
        {"name": moment().add(3,'d').format('DD/MM'),"value": 2},
        {"name": moment().add(4,'d').format('DD/MM'),"value": 0},
      ]
    }
  ];

  view: any[] = [];
  showLegendPie: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  xAxisLabel: string = 'Date';
  timeline: boolean = true;
  yAxisLabel: string = 'Qty';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() { }

  ngOnInit(): void {
  }

}
