import { Injectable } from '@angular/core';
import { ValidatorService } from 'src/app/core/validator/validator.service';
import { Order } from '../models/order.model';
import { OrderLine } from '../models/order-line.model';

@Injectable({
  providedIn: 'root'
})
export class OrderValidatorService extends ValidatorService {
  isDataValid(data: Order, orderLines: any) {
    this.errors = [];


    if(!this.isDropdownSupplied(data.siteId)) {
     // this.errors.push('main.siteId');
    }

    if(!this.isDropdownSupplied(data.accountId)) {
     // this.errors.push('main.accountId');
    }

    if(!this.isDropdownSupplied(data.orderTypeId)) {
      this.errors.push('main.orderTypeId');
    }

    if(!this.isDropdownSupplied(data.tipSiteId)) {
      this.errors.push('main.tipSiteId');
    }

    if(!this.isSupplied(data.date)) {
      this.errors.push('main.date');
    }

    if(!this.isSupplied(data.time)) {
      this.errors.push('main.time');
    }



    // Only if skips
    if(data.orderTypeId === 1) {
      if(!this.isDropdownSupplied(data.skipOrderTypeId)) {
        this.errors.push('main.skipOrderTypeId');
      }
      if(!this.isDropdownSupplied(data.containerSizeTypeId)) {
        this.errors.push('main.containerSizeTypeId');
      }
      if(!this.isDropdownSupplied(data.containerTypeId)) {
        this.errors.push('main.containerTypeId');
      }
      if(!this.isDropdownSupplied(data.gradeId)) {
        this.errors.push('main.gradeId');
      }
    }

    // only if type 9
    if(data.orderTypeId === 8) {
      if(!this.isDropdownSupplied(data.containerTypeId)) {
        this.errors.push('main.containerTypeId');
      }
    }


    if(orderLines !== null) {
      if(orderLines.orderLines.length === 0) {
        this.errors.push('product.orderlines');
      }
    }

    return this.errors.length === 0;
  }
 }
