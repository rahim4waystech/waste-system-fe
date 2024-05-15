import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
declare var $;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  showTopLevelItems:boolean = true;
  showAccounts:boolean = false;
  showVehicles:boolean = false;
  showTimelines:boolean = false;
  isFullMenu: boolean = false;
  wasInside: boolean = false;

  menuItems:any = [
    {
      name: 'Home',order: 0,title: 'Home',icon: 'fas fa-fw fa-home',link: '/home', isActive: 'home',subscribed:true, display:false,subItems:[]
    },
    {
      name: 'CRM',order: 1,title: 'CRM',icon: 'fas fa-dice-d6',link: '', isActive: 'crm',subscribed:true, display:false,
      subItems: [
        {name: 'Accounts',order: 0,title: 'Accounts',icon:'fas fa-fw fa-user-friends',link:'/accounts', isActive: 'accounts',subscribed:this.authService.checkIfHasPermissionArea(1),},
        {name: 'Contacts',order: 1,title: 'Contacts',icon:'fas  fa-address-book',link:'/contacts', isActive: 'contacts',subscribed:environment.paidModules.contacts && this.authService.checkIfHasPermissionArea(2),},
        {name: 'Leads',order: 2,title: 'Leads',icon:'fas fa-pepper-hot',link:'/leads', isActive: 'leads',subscribed:(environment.paidModules.leads && environment.crmOptions.showLeads && this.authService.checkIfHasPermissionArea(3)),},
        {name: 'Opportunities',order: 3,title: 'Opportunities',icon:'fas fa-trophy',link:'/opportunities', isActive: 'opportunities',subscribed:(environment.paidModules.opportunities && environment.crmOptions.showOpps && this.authService.checkIfHasPermissionArea(4)),},
        {name: 'Contracts',order: 4,title: 'Contracts',icon:'fas fa-file-signature',link:'/contracts', isActive: 'contracts',subscribed:this.authService.checkIfHasPermissionArea(5) && environment.paidModules.contracts},
        {name: 'Calendars',order: 4,title: 'Calendars',icon:'fas fa-calendar-alt',link:'/calendar', isActive: 'calendar',subscribed:this.authService.checkIfHasPermissionArea(26) && environment.paidModules.calendars},

      ]
    },
    {
      name: 'Fleet Management',order: 2,title: 'Fleet management',icon: 'fas fa-truck',link:'', isActive: 'fleet-management',subscribed:true, display:false,
      subItems: [
        {name: 'Vehicles',order: 0,title: 'Vehicles',icon: 'fas fa-fw fa-truck',link:'/vehicles', isActive: 'vehicles',subscribed:this.authService.checkIfHasPermissionArea(6),},
        {name: 'Drivers',order: 1,title: 'Drivers',icon:'fa-fw fas fa-user',link:'/drivers', isActive: 'drivers',subscribed:this.authService.checkIfHasPermissionArea(7),},
        {name: 'Containers',order: 2,title: 'Containers',icon: 'fas fa-fw fa-dumpster',link:'/containers', isActive: 'containers',subscribed:environment.paidModules.containers && this.authService.checkIfHasPermissionArea(8),},
        {name: 'Subcontractors',order: 3,title: 'Subcontractors',icon:'fas fa-fw fa-people-carry',link:'/subcontractors', isActive: 'subcontractors',subscribed:this.authService.checkIfHasPermissionArea(9),},
      ]
    },
    {
      name: 'Ordering',order: 3,title: 'Ordering',icon: 'far fa-handshake',link: '', isActive: 'ordering',subscribed:true, display:false,
      subItems: [
        {name: 'Price Lists',order: 0,title: 'Price Lists',icon:'fas fa-tag',link:'/price-list', isActive: 'price-list',subscribed:this.authService.checkIfHasPermissionArea(27),},
        {name: 'Quoting',order: 1,title: 'Quoting',icon:'fas fa-fw fa-pound-sign',link:'/quoting', isActive: 'quoting',subscribed:this.authService.checkIfHasPermissionArea(10) && environment.paidModules.quoting,},
        {name: 'Orders',order: 2,title: 'Orders',icon:'fas fa-fw fa-truck-loading',link:'/orders', isActive: 'orders',subscribed:this.authService.checkIfHasPermissionArea(11),},
        {name: 'Orders Artic',order: 3,title: 'Orders Artic',icon:'fas fa-fw fa-truck-loading',link:'/orders/artics', isActive: '/orders/artics',subscribed:this.authService.checkIfHasPermissionArea(0),},
      ]
    },
    {
      name: 'Jobs',order: 4,title: 'Jobs',icon: 'fas fa-fw fa-columns',link:'', isActive: 'jobs',subscribed:true, display:false,
      subItems: [
        {name: 'Transport Timelines',order: 0,title: 'Transport Timelines',icon:'fas fa-hard-hat',link:'/timeline', isActive: 'timeline',subscribed:environment.paidModules.landServicesTimeline && this.authService.checkIfHasPermissionArea(12),},
       
        // {name: 'Timelines Artic',order: 1,title: 'Artic Timelines',icon:'fas fa-hard-hat',link:'/timeline/artics', isActive: 'timeline/artics',subscribed:environment.paidModules.landServicesTimeline && this.authService.checkIfHasPermissionArea(0),},
        //{name: 'Skip Timeline',order: 2,title:'Skip Timeline' ,icon:'fas fa-columns',link:'/skips', isActive: 'skips',subscribed:environment.paidModules.skipsTimeline && this.authService.checkIfHasPermissionArea(14),},
        // {name: 'Artic Timeline',order: 2,title: 'Artics Timeline',icon:'fas fa-snowflake',link:'/artics', isActive: 'artics',subscribed:environment.paidModules.articsTimeline,},
        // {name: 'All Jobs',order: 3,title: 'All Jobs',icon:'fas fa-archive',link:'/jobs', isActive: 'jobs',subscribed:true,},
        //{name: 'Weighbridge',order: 3,title: 'Weighbridge',icon:'fas fa-balance-scale',link:'/weighbridge', isActive: 'weighbridge',subscribed:environment.paidModules.weighbridge && this.authService.checkIfHasPermissionArea(16),},
        {name: 'Fuel',order: 4,title: 'Fuel',icon:'fas fa-fw fa-gas-pump',link:'/fuel', isActive: '/fuel',subscribed:this.authService.checkIfHasPermissionArea(17) && environment.paidModules.fuel,},
        {name: 'Job Signoff',order: 5,title: 'Job Signoff',icon:'fas fa-check-circle',link:environment.defaults.signoffURL, isActive: 'job-signoff',subscribed:this.authService.checkIfHasPermissionArea(18),},
        {name: 'Proof of Delivery', order: 6, title: 'Proof Of Delivery', icon: 'fas fa-file-signature', link: '/pods', isActive: 'pods', subscribed: this.authService.checkIfHasPermissionArea(28)},
        {name: 'Transport Timelines2',order: 7,title: 'Transport Timelines2',icon:'fas fa-hard-hat',link:'/timeline2', isActive: 'timeline2',subscribed:this.authService.checkIfHasPermissionArea(29),},
       
      ]
    },
    {
      name: 'Workshop',order: 5,title: '4Workshop',icon: 'fas fa-wrench',link: '/4workshop', isActive: '4workshop',subscribed:environment.paidModules.workshop, display:false,
      subItems: [
        {name: '4Workshop Dashboard',order: 0,title: '4Workshop Dashboard',icon:'fas fa-fw fa-wrench',link:'/4workshop', isActive: '4workshop',subscribed:environment.paidModules.workshop},
        {name: 'Vehicles',order: 1,title: 'Workshop Vehicles',icon:'fas fa-fw fa-truck',link:'/4workshop/vehicles', isActive: 'vehicles',subscribed:environment.paidModules.workshop,},
        {name: 'Vehicle Defects',order: 2,title: 'Vehicle Defects',icon:'fas fa-exclamation-triangle',link:'4workshop/defects', isActive: 'defects',subscribed:environment.paidModules.workshop,},
        {name: 'Defect Scheduling',order: 3,title: 'Defect Scheduling',icon:'fas fa-user-clock',link:'4workshop/timeline/workshop', isActive: '4workshop/timeline/workshop',subscribed:environment.paidModules.workshop,},
        {name: 'Fitters',order: 4,title: 'Fitters',icon:'fas fa-user-ninja',link:'4workshop/fitters', isActive: '4workshop/fitters',subscribed:environment.paidModules.workshop,},
        {name: 'Calendar',order: 5,title: 'Calendar ',icon:'fas fa-calendar-alt',link:'4workshop/schedule', isActive: 'schedule',subscribed:environment.paidModules.workshopDefectScheduling,},
        {name: 'Asset Register',order: 6,title: 'Asset Register',icon:'fas fa-cash-register',link:'4workshop/asset-register', isActive: 'asset-register',subscribed:true,},
        {name: 'Parts Register',order: 7,title: 'Parts Register',icon:'fas fa-car-battery',link:'4workshop/parts-register', isActive: 'parts-register',subscribed:true,},
        {name: 'Documents',order: 8,title: 'Documents',icon:'fas fa-file-alt',link:'4workshop/documents', isActive: 'documents',subscribed:environment.paidModules.workshopDocs,},
        // {name: 'Reporting',order: 5,title: 'Reporting',icon:'fas fa-chart-line',link:'4workshop/reporting', isActive: 'reporting',subscribed:environment.paidModules.workshopReporting,},
        {name: 'Settings',order: 9,title: 'Settings',icon:'fas fa-cogs',link:'4workshop/settings', isActive: 'settings',subscribed:environment.paidModules.workshop,},
      ]
    },
    {
      name: 'Invoicing',order: 6,title: 'Invoicing',icon: 'fas fa-calculator',link: '/', isActive: 'invoicing',subscribed:true, display:false,
      subItems: [
        {name: 'Invoices',order: 0,title: 'Invoices',icon:'fas fa-money-check',link:'/invoices', isActive: 'invoices',subscribed:this.authService.checkIfHasPermissionArea(20),},
        {name: 'Financial Exports',order: 1,title: 'Financial Exports',icon:'fas fa-file-invoice-dollar',link:'/export', isActive: 'export',subscribed:this.authService.checkIfHasPermissionArea(21),},
        {name: 'Credit Notes',order: 1,title: 'Credit Notes',icon:'fas fa-sticky-note',link:'/credit-note', isActive: 'export',subscribed:true},
      ]
    },
    // {
    //   name: 'Compliance',order: 7,title: 'Compliance',icon: 'fas fa-notes-medical',link: '/compliance',isActive: 'compliance',subscribed:true,
    //   subItems:[

    //   ]
    // },
    {name: 'Reporting',order: 8,title: 'Reporting',icon: 'fas fa-chart-line',link: '/reporting',isActive: 'reporting',subscribed:this.authService.checkIfHasPermissionArea(22),subItems:[]},
    {name: 'Settings',order: 9,title: 'Settings',icon: 'fas fa-cog',link:'/settings', isActive: 'settings',subscribed:this.authService.checkIfHasPermissionArea(23),display:false,subItems:[]}
  ]

  constructor(private router: Router,
    private authService: AuthService,
    private sidebarService: SidebarService) { }

  ngOnInit(): void {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    })
  }



  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.isFullMenu = false;
    }
    this.wasInside = false;
  }

  goToLink(link: string): void {
   
    this.router.navigateByUrl(link);
    // this.isFullMenu = false;
  }

  getLogo() {
    return environment.logo;
  }

  isActive(areaName: string) {
    return window.location.href.indexOf(areaName) !== -1;
  }

  getVisible(): boolean {
    return this.sidebarService.visible;
  }

  isItemShown(subItems: any) {
    return subItems.filter(s => s.subscribed).length > 0;
  }

  // showSecondLevel(item:string){
  //   switch(item){
  //     case 'top':
  //       this.showTopLevelItems = true;
  //       this.showAccounts = false;
  //       this.showVehicles = false;
  //       this.showTimelines = false;
  //       break;
  //     case 'vehicles':
  //       this.showTopLevelItems = false;
  //       this.showAccounts = false;
  //       this.showVehicles = true;
  //       this.showTimelines = false;
  //       break;
  //     case 'timelines':
  //       this.showTopLevelItems = false;
  //       this.showAccounts = false;
  //       this.showVehicles = false;
  //       this.showTimelines = true;
  //       break;
  //     case 'accounts':
  //       this.showTopLevelItems = false;
  //       this.showAccounts = true;
  //       this.showVehicles = false;
  //       this.showTimelines = false;
  //       break;
  //   }
  // }
  getUsername(): string {
    return this.authService.getUser().firstName + ' ' + this.authService.getUser().lastName;
  }
  
}
