import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-edit-sites',
  templateUrl: './order-edit-sites.component.html',
  styleUrls: ['./order-edit-sites.component.scss']
})
export class OrderEditSitesComponent implements OnInit {

  accountId: number = -1;
  order: Order = new Order();
  buttons: GridButton[] = [
    {label: 'Select', type: 'btn-primary', action: this.select.bind(this)} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Account Ref', field: 'accountRef', value: v => !v || v === '' ? '<span style="color:red;font-weight:bold;">NO ACCOUNT REF</span>' : v} as GridColumn,
    {active: true, label: 'Type', field: 'type.name', value: (value, record) => record.type === null ? 'N/A': record.type.name  } as GridColumn,
    {active: true, label: 'Contact', field: 'contact'} as GridColumn,
    {active: true, label: 'Contact Number', field: 'phoneNumber'} as GridColumn,
    {active: true, label: 'Address', field: 'billingAddressLine1', value: this.getAddressDetails.bind(this)} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [
  ]
  searchFields: any = ['name','accountRef','type.name','contact','phoneNumber'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'name',
      label: 'Name',
    } as GridSearchFilter,
    {
      field: 'accountRef',
      label: 'Account Ref',
    } as GridSearchFilter,
    {
      field: 'type.name',
      label: 'Type',
    } as GridSearchFilter,
    {
      field: 'contact',
      label: 'Contact',
    } as GridSearchFilter,
    {
      field: 'phoneNumber',
      label: 'Contact Number',
    } as GridSearchFilter,
  ]

  constructor(private router: Router, private route:ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {

      this.loadOrder(+params['id'])

      this.accountId = +params['accountId'];
      // this.filters.push({
      //   condition: 'in',
      //   value:  [+params['accountId'], -1],
      //   field: 'parentId',
      // } as GridFilter)

      this.filters.push({
        condition: 'eq',
        value:  "13",
        field: 'type_id',
      } as GridFilter)

      this.filters.push({
        condition: 'ne',
        value: 0,
        field: 'isactive',
      })
    });
  }

  loadOrder(orderId: number) {
    this.orderService.getOrderById(orderId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load order by id')
      return e;
    }))
    .subscribe((order: Order) => {
      this.order = order;
    })
  }


addSite() {
  this.router.navigateByUrl('/accounts/site/' + this.accountId);
}
  select(button, record): void {
    if(!record.accountRef || record.accountRef.trim() === '') {
      alert('You cannot select an account without a reference.');
      return;
    } else {

      this.order.accountId = this.accountId;
      this.order.account = {id: this.accountId} as any;
      this.order.siteId = record.id;
      this.order.site = {id: record.id} as any;

      this.orderService.updateOrder(this.order)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('could not update order');
        return e;
      }))
      .subscribe((order) => {
        this.router.navigateByUrl('/orders/edit/' + this.order.id);
      })
    }
  }

  getAddressDetails(value, record): string {
    let address = '';

    if(record.billingAddress1.trim() !== '') {
      address += record.billingAddress1 + '<br />';
    }

    if(record.billingAddress2.trim() !== '') {
      address += record.billingAddress2 + '<br />';
    }

    if(record.billingCity.trim() !== '') {
      address += record.billingCity + '<br />';
    }

    if(record.billingCountry.trim() !== '') {
      address += record.billingCountry + '<br />';
    }

    if(record.billingPostCode.trim() !== '') {
      address += record.billingPostCode;
    }

    return address;
  }

}
