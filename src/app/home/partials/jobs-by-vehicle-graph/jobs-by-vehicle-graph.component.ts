import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jobs-by-vehicle-graph',
  templateUrl: './jobs-by-vehicle-graph.component.html',
  styleUrls: ['./jobs-by-vehicle-graph.component.scss']
})
export class JobsByVehicleGraphComponent implements OnInit {
  dataGraph1 = [
    {
      "name": "Hook",
      "series": [
        {"name": "In Progress","value": 6},
        {"name": "Completed","value": 32},
        {"name": "Billed","value": 23}
      ]
    },

    {
      "name"  : "RO/RO",
      "series": [
        {"name": "In Progress","value": 14},
        {"name": "Completed","value": 13},
        {"name": "Billed","value": 21}
      ]
    },

    {
      "name": "Chain",
      "series": [
        {"name": "In Progress","value": 34},
        {"name": "Completed","value": 1},
        {"name": "Billed","value": 3}
      ]
    }
  ];

  view: any[] = [];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegendGraph1: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabelGraph1: string = 'Vehicle Type';
  yAxisLabelGraph1: string = 'Qty';
  animations: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() { }

  ngOnInit(): void {
  }

}
