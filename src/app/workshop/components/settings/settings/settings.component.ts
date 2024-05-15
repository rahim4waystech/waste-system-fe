import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  items = [
    {name: 'Driver Checks',icon:'fas fa-clipboard',link:'/driverchecks',enabled:true},
    {name: 'Inspection Intervals & Dates',icon:'fas fa-calendar',link:'/inspection-intervals',enabled:true},
    {name: 'Defect Severities',icon:'fas fa-exclamation-triangle',link:'/severities',enabled:true},
    {name: 'Vehicle Check Areas',icon:'fas fa-oil-can',link:'/check-areas',enabled:true},
    {name: 'Part Categories',icon:'fas fa-snowplow',link:'/part-categories',enabled:true},
    {name: 'Asset Register Categories',icon:'fas fa-folder-open',link:'/asset-categories',enabled:true},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  isActive(areaName: string) {
    return window.location.href.indexOf(areaName) !== -1;
  }

}
