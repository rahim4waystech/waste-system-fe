import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Account } from 'src/app/order/models/account.model';
import { Order } from 'src/app/order/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class SimpleOrderValidatorService extends ValidatorService {

  isDataValid(data: Order, orderLines: any, account: Account, site: Account, tipSite: Account) {
    this.errors = [];


    if (!this.isDropdownSupplied(data.accountId)) {

      if (data.account.name === '') {
        this.errors.push('customer.name');
      }

      if (data.account.accountRef === '') {
        this.errors.push('customer.accountRef');
      }

      if (data.account.name === '' && account.accountRef === '') {
        this.errors.push('customer.accountId');
      }
    }

    if (!this.isDropdownSupplied(data.siteId)) {

      if (data.site.name === '') {
        this.errors.push('site.name');
        this.errors.push('site.siteId');
      }
    }

    if (!this.isDropdownSupplied(data.tipSiteId)) {

      if (data.tipSite.name === '') {
        this.errors.push('tipSite.name');
        this.errors.push('tipSite.tipSiteId');
      }
    }


    if (!this.isDropdownSupplied(data.orderTypeId)) {
      this.errors.push('main.orderTypeId');
    }

    if (!this.isSupplied(data.date)) {
      this.errors.push('main.date');
    }

    if (!this.isSupplied(data.time)) {
      this.errors.push('main.time');
    }



    // Only if skips
    if (data.orderTypeId === 1) {
      if (!this.isDropdownSupplied(data.skipOrderTypeId)) {
        this.errors.push('main.skipOrderTypeId');
      }
      if (!this.isDropdownSupplied(data.containerSizeTypeId)) {
        this.errors.push('main.containerSizeTypeId');
      }
      if (!this.isDropdownSupplied(data.containerTypeId)) {
        this.errors.push('main.containerTypeId');
      }
      if (!this.isDropdownSupplied(data.gradeId)) {
        this.errors.push('main.gradeId');
      }
    }

    // only if type 9
    if (data.orderTypeId === 8) {
      if (!this.isDropdownSupplied(data.containerTypeId)) {
        this.errors.push('main.containerTypeId');
      }
    }


    if (orderLines !== null) {
      if (orderLines.orderLines.length === 0) {
        this.errors.push('product.orderlines');
      }
    }

    console.log(this.errors);

    return this.errors.length === 0;
  }
}
