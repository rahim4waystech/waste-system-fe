import { Injectable } from "@angular/core";
import { ValidatorService } from "src/app/core/validator/validator.service";
import { YardTradePricing } from "../models/yard-trade-pricing.model";

@Injectable({
    providedIn: 'root'
  })
  export class YardTradePricingValidatorService extends ValidatorService {
    isDataValid(data: YardTradePricing) {
      this.errors = [];
  
      if(!this.isSupplied(data.price)) {
        this.errors.push('price');
      }
  
      if(!this.isDropdownSupplied(data.unitId)) {
        this.errors.push('untiId');
      }
  
      if(!this.isSupplied(data.name)) {
        this.errors.push('name');
      }
  
  
      if(!this.isSupplied(data.qty)) {
        this.errors.push('qty');
      }
  
      return this.errors.length === 0;
    }
   }