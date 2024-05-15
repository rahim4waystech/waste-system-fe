import { forwardRef, OnChanges } from '@angular/core';
import { Component, OnInit,Input, SimpleChange, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Grade } from 'src/app/container/models/grade.model';
import { ContainerService } from 'src/app/container/services/container.service';
import { Account } from 'src/app/order/models/account.model';
import { Unit } from 'src/app/order/models/unit.model';
import { OrderService } from 'src/app/order/services/order.service';
import { PriceListItem } from '../../models/price-list-item.model';
import { PriceListOtherItem } from '../../models/price-list-other-item.model';
import { ServiceType } from '../../models/service-type.model';
import { PriceListService } from '../../services/price-list.service';

import { PriceList } from './../../models/price-list.model';

@Component({
  selector: 'app-price-list-form',
  templateUrl: './price-list-form.component.html',
  styleUrls: ['./price-list-form.component.scss'],
})
export class PriceListFormComponent implements OnInit, OnChanges {

  @Input()
  priceList: PriceList = new PriceList();

  @Input()
  account: Account = new Account();

  units: Unit[] = [];
  sites: Account[] = [];

  @Input()
  priceListItems: any = {items: []};


  @Input()
  otherItems: any = {items: []};

  @Input()
  editMode: boolean = false;

  serviceTypes: ServiceType[] = [];

  newPriceListItem: PriceListItem = new PriceListItem();

  newOtherItem: any = new PriceListOtherItem();

  grades: Grade[] = [];

  constructor(private accountService: AccountService,
    private orderService: OrderService,
    private containerService: ContainerService,
    private priceListService: PriceListService,
    private route: ActivatedRoute) { }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.priceList) {
      if(simple.priceList.currentValue.id !== -1) {
        this.loadAccount(simple.priceList.currentValue.accountId);
      }
    }
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {

      if(this.editMode === false) {
        this.loadAccount(+params['id']);
      }
    })

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load units');
      return e;
    }))
    .subscribe((units: Unit[]) => {
      this.units = units;
    })

    this.priceListService.getAllServiceTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load service types');
      return e;
    }))
    .subscribe((data: ServiceType[]) => {
      this.serviceTypes = data;
    });

    this.containerService.getAllGrades()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load grades');
      return e;
    }))
    .subscribe((grades: Grade[]) => {
      this.grades = grades;
    })
  }

  loadAccount(id: number) {
    this.accountService.getAccountById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load account');
      return e;
    }))
    .subscribe((account: Account) => {
      this.account = account;
      this.priceList.account = {id: this.account.id} as any;
      this.priceList.accountId = this.account.id;
      this.loadSites();
    })
  }

  loadSites() {
    this.accountService.getAllSitesForAccount(this.account.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not sites for account');
      return e;
    }))
    .subscribe((sites: Account[]) => {
      this.sites = sites;
    })
  }

  onServiceTypeChanged($event) {
    this.newPriceListItem.name = "";
    this.newPriceListItem.name = $event.target.value;
  }

  onServiceTypeCurrentChanged($event, item: PriceListItem) {
    item.name = "";
    item.name = $event.target.value;
  }

  saveItem() {

    if(this.newPriceListItem.name === "" || this.newPriceListItem.price <= 0 || this.newPriceListItem.unitId === -1) {
      alert('You must fill out all required fields');
      return;
    }

    this.priceListItems.items.push(JSON.parse(JSON.stringify(this.newPriceListItem)));
    this.newPriceListItem = new PriceListItem();
  }

  saveOtherItem() {

    if(this.newOtherItem.name === "" || this.newOtherItem.price <= 0 || this.newOtherItem.unitId === -1) {
      alert('You must fill out all required fields');
      return;
    }

    this.otherItems.items.push(JSON.parse(JSON.stringify(this.newOtherItem)));
    this.newOtherItem = new PriceListOtherItem();
  }

  deleteItem(i) {
    this.priceListItems.items.splice(i, 1);

    alert('Item has been removed');
  }

}
