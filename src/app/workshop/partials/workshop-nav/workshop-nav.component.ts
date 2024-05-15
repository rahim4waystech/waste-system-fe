import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-workshop-nav',
  templateUrl: './workshop-nav.component.html',
  styleUrls: ['./workshop-nav.component.scss']
})
export class WorkshopNavComponent implements OnInit {
  navItems = [
    {name: 'Vehicles',icon:'fas fa-truck',link:'/vehicles',subscribed:true},
    {name: 'Defects',icon:'fas fa-exclamation-triangle',link:'/defects',subscribed:true},
    {name: 'Defect Scheduling',icon:'fas fa-user-clock',link:'/timeline/workshop',subscribed:true},
    {name: 'Defect Sign off',icon:'fas fa-check-circle',link:'/signoff',subscribed: true},
    {name: 'Fitters',icon:'fas fa-user-ninja',link:'/fitters',subscribed:true},
    {name: 'Calendar',icon:'fas fa-calendar-alt',link:'/schedule',subscribed: environment.paidModules.workshopDefectScheduling},
    {name: 'Asset Register',icon:'fas fa-cash-register',link:'/asset-register',subscribed: environment.paidModules.assetRegister},
    {name: 'Parts Register',icon:'fas fa-car-battery',link:'/parts-register',subscribed: environment.paidModules.assetRegister},
    {name: 'Documents',icon:'fas fa-file-alt',link:'/documents',subscribed: environment.paidModules.workshopDocs},
    // {name: 'Reporting',icon:'fas fa-chart-line',link:'/reporting',subscribed: environment.paidModules.workshopReporting},
    {name: 'Settings',icon:'fas fa-cogs',link:'/settings',subscribed:true},
  ];

  constructor() { }

  ngOnInit(): void {
  }

  isActive(areaName: string) {
    return window.location.href.indexOf(areaName) !== -1;
  }

}
