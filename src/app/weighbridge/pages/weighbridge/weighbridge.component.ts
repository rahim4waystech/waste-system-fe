import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { catchError, take } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { Order } from 'src/app/order/models/order.model';
import { TippingPrice } from 'src/app/account/models/tipping-price.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { ModalService } from 'src/app/core/services/modal.service';

import { environment } from 'src/environments/environment';
import { JobService } from 'src/app/timeline-skip/services/job.service';

@Component({
  selector: 'app-weighbridge',
  templateUrl: './weighbridge.component.html',
  styleUrls: ['./weighbridge.component.scss']
})
export class WeighbridgeComponent implements OnInit {
  displayDate = moment().format('LL');
  defaultTip:number =  environment.defaults.defaultWeighbridgeDepot;

  currentJob: Job = new Job();
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  tips: Account[] = [];

  statuses:any[] = [
    "Pending",
    "Pending",
    "Cleared",
    "Printed",
  ]

  tipId: number = -1;
  buttons: GridButton[] = [
    {label: 'Set Weight', type: 'btn-warning', action: (button,record) => { this.openModal('setWeightModal', record) }} as GridButton,
    {label: 'Print Transfer note', type: 'btn-primary', action: (button, record) => {this.onPrintTicket(record);} } as GridButton,
  ]
  columns: GridColumn[] = [
    // {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Order Number', field: 'job.id', value: (v, r) => r.order.id + '/' + r.id} as GridColumn,
    {active: true, label: 'Gross Weight', field: 'weight', value: (v, r) =>  this.getWeightValue(r)} as GridColumn,
    {active: true, label: 'Tare Weight', field: 'jobAssignment.vehicle.tareWeight', value: (v,r) => r.jobAssignment.vehicle.tareWeight + environment.defaults.tareWeightUnit} as GridColumn,
    {active: true, label: 'Vehicle', field: 'jobAssignment.vehicle.registration'} as GridColumn,
    // {active: true, label: 'Container', field: 'order.containerSizeType.size', value: (v,r) => r.order.containerSizeType.size + ' Yard (' + r.order.containerType.name + ')'} as GridColumn,
    // {active: true, label: 'Grade', field: 'order.grade.name'} as GridColumn,
    {active: true, label: 'Company', field: 'order.account.name', value: (v, r) => r.order.account.name + ' - ' + r.order.site.name} as GridColumn,
    {active: true, label: 'Tip', field: 'order.tipSiteId', value: (v, r) => { return this.getTipNameFromId(r.order.tipSiteId) } } as GridColumn,
    {active: true, label: 'Status', field: 'weightStatusId', value: (v, r) => { return !this.statuses[v] ? 'Pending' : this.statuses[v] }} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Show transport signed off jobs for charges only and transport sign off
  filters: GridFilter[] = [
    {
      field: 'jobStatusId',
      condition: 'in',
      value: [2,4],
    } as GridFilter
  ]

  /* Save Marks mistake for later lessons
  ,
  {
    field: 'jobStatusId',
    condition: 'ne',
    value: '3'
  } as GridFilter,
  {
    field: 'jobStatusId',
    condition: 'ne',
    value: '5'
  } as GridFilter,
  {
    field: 'jobStatusId',
    condition: 'ne',
    value: '-1'
  } as GridFilter,
  {
    field: 'jobStatusId',
    condition: 'ne',
    value: '0'
  } as GridFilter,
  */

  searchFields: any = ['date','time','order.account.name','order.containerType.name','order.site.name','order.containerSizeType.size','order.grade.name','jobAssignment.driver.firstName','jobAssignment.driver.lastName','jobAssignment.vehicle.registration'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'date',
      label: 'Date',
      type: 'date',
    } as GridSearchFilter,
    {
      field: 'time',
      label: 'Time',
    } as GridSearchFilter,
    {
      field: 'order.account.name',
      label: 'Account Name',
    } as GridSearchFilter,
    {
      field: 'order.containerType.name',
      label: 'Container Type',
    } as GridSearchFilter,
    {
      field: 'order.site.name',
      label: 'Site Name',
    } as GridSearchFilter,
    {
      field: 'order.containerSizeType.size',
      label: 'Container Size',
    } as GridSearchFilter,
    {
      field: 'order.grade.name',
      label: 'Grade',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.driver.firstName',
      label: 'Driver First Name',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.driver.lastName',
      label: 'Driver Last Name',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.vehicle.registration',
      label: 'Vehicle registration',
    } as GridSearchFilter,
  ]

  selectedJobs: Job[] = [];

  constructor(private accountService: AccountService,
    private jobService: JobService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.loadTips();

    this.onTipChanged({target: {value: this.defaultTip}});
  }

  loadTips() {
    this.accountService.getAllTips()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load tips for weighbridge');
      return e;
    }))
    .subscribe((tips: Account[]) => {
      this.tips = tips;
    })
  }

  getAddressForOrder(order: Order): string {
    let address: string  = '';

    if(order.site.name.trim() !== "") {
     address += ',' + order.site.name;
   }

     if(order.site.shippingAddress1.trim() !== "") {
       address += ',' + order.site.shippingAddress1;
     }

     if(order.site.shippingAddress2.trim() !== "") {
       address += ',' + order.site.shippingAddress2;
     }

     if(order.site.shippingCity.trim() !== "") {
       address += ',' + order.site.shippingCity;
     }

     if(order.site.shippingCountry.trim() !== "") {
       address += ',' + order.site.shippingCountry;
     }

     if(order.site.shippingPostCode.trim() !== "") {
       address += ',' + order.site.shippingPostCode;
     }

     return address.substring(1);
   }

   getTippingPriceValue(record) {
    if(record.tippingPrice) {
      if(record.tippingPrice.price <= 0) {
        return '<span style="color: red; font-weight:bold;">0.00<span>';
      } else {
        return record.tippingPrice.price.toFixed(2);
      }
    }
    return '<span style="color: red; font-weight:bold;">0.00<span>';

   }

   getWeightValue(record) {
      if(record.weight === 0) {
        return '<span style="color: red; font-weight:bold;">0' + environment.defaults.tareWeightUnit + '<span>';
      } else {
        return record.weight + environment.defaults.tareWeightUnit;
      }

   }

   getTipNameFromId(id: number): string {
    const tip = this.tips.filter(t => t.id === id)[0];

    if(tip === undefined) {
      return 'N/A';
    } else {
      return tip.name;
    }
   }

   onTipChanged($event) {

     this.tipId = +$event.target.value;

     this.gridComponent.filters = [
      {
       condition: 'eq',
       field: 'tipSiteId',
       value: +$event.target.value,
     } as GridFilter
    ]

   }

   openModal(modal:string, record) {
    this.currentJob = record;


    this.modalService.open(modal);

   }

   onCheckboxChange($event) {
   }

   onPrintTicket(record) {
     const invoiceInfo = environment.invoicing;

      this.jobService.generateWasteTransferNote({ job: record, invoiceInfo: invoiceInfo})
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not generate waste transfer note')
        return e;
      }))
      .subscribe((data: any) => {
        window.open(environment.publicUrl + data.fileName, '_blank');
      })

   }

}
