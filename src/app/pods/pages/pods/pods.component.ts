import { Component, OnInit } from '@angular/core';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { DriverJobMovement } from '../../models/driver-job-movement.model';
import { OrderService } from 'src/app/order/services/order.service';
import { take, catchError } from 'rxjs/operators';
import { Order } from 'src/app/order/models/order.model';
import { Router } from '@angular/router';
import { PodService } from '../../services/pod.service';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-pods',
  templateUrl: './pods.component.html',
  styleUrls: ['./pods.component.scss']
})
export class PodsComponent implements OnInit {

  selectedPods: any = {pods: []}
  orders: Order[] = [];

  buttons: GridButton[] = [
    {label: 'Edit', link: '/pods/view/:id', type: 'btn-warning',} as GridButton, 
    {label: 'Delete', link: '/pods/delete/:id', type: 'btn-danger',} as GridButton,
    {label: 'View Order', action: (button, record) => {
      this.router.navigateByUrl('/orders/edit/' + record.job.order.id);
    }, type: 'btn-primary',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: 'POD Number', field: 'id', value: v => 'DWS' + v} as GridColumn,
    {active: true, label: 'Driver', field: 'driver.firstName', value: (v,r) => r.driver.firstName + ' ' + r.driver.lastName} as GridColumn,
    {active: true, label: 'Vehicle', field: 'vehicle.registration'} as GridColumn,
    {active: true, label: 'Customer', field: 'job.order.accountId', value:(v,r) => this.getOrder(r.job.orderId).account.name} as GridColumn,
    {active: true, label: 'Site', field: 'job.order.siteid', value:(v,r) => this.getOrder(r.job.orderId).site.name} as GridColumn,
    {active: true, label: 'Order type', field: 'job.order.orderTypeId', value:(v,r) => this.getOrder(r.job.orderId).orderType.name} as GridColumn,
    {active: true, label: 'Qty', field: 'qty', value: v => !v ? 0: v} as GridColumn,
    {active: true, label: 'Tip Site', field: 'job.order.tipSiteId', value:(v,r) => this.getOrder(r.job.orderId).tipSite.name} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];
  // Org filter handled at API level
  filters: GridFilter[] = [
    {
      condition: 'eq',
      field: 'active',
      value: 1,
    } as GridFilter
  ]
  searchFields: any = ['id'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'id',
      label: 'TicketNumber',
    } as GridSearchFilter,
  ]

  constructor(private orderService: OrderService,
    private podService: PodService,
    private modalService: ModalService,
    private router: Router) { }

  ngOnInit(): void {
  }

  recordUpdated(records: DriverJobMovement[]) {
    let ids = [];

    records.forEach((record:any) => {
      ids.push(record.job.orderId);
    });

    this.orderService.getOrdersByIds(ids)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load orders');
      return e;
    }))
    .subscribe((orders: any) => {
      this.orders = orders;
    });
  }

  getOrder(id: number) {
    return this.orders.filter(o => o.id === id)[0];
  }

  onCheckedSelected($event) {
    if($event.checked) {
      this.selectedPods.pods.push($event.record);
    } else {
      this.selectedPods.pods = this.selectedPods.pods.filter(j => j.id !== $event.record.id);
    }
  }

  batchPrintPODs() {
    // this.podService.getBatchPDF(this.selectedPods.pods.map(sp => sp.id))
    // .pipe(take(1))
    // .pipe(catchError((e) => {
    //   alert('could not load pods')
    //   return e;
    // }))
    // .subscribe((data: any) => {
    //   window.open(environment.publicUrl + data.fileName, '_blank');    })

    if(this.selectedPods.pods.length === 0) {
      alert('Please select at least one pod to print');
      return;
    }

    this.modalService.open("printPodModal");
  }

  email() {

    if(this.selectedPods.pods.length === 0) {
      alert('Please select at least one pod to email');
      return;
    }

    this.modalService.open("emailPODModal");

  }

}
