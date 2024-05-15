import { Component, OnInit } from '@angular/core';
import { take, catchError } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Unit } from 'src/app/order/models/unit.model';
import { OrderService } from 'src/app/order/services/order.service';
import { YardTradePricing } from '../../models/yard-trade-pricing.model';
import { YardtradeStateService } from '../../services/yardtrade-state.service';
import { YardTradePricingValidatorService } from '../../validators/yardtrade-pricing-validator.service';

@Component({
  selector: 'app-yard-trade-pricing-add-modal',
  templateUrl: './yard-trade-pricing-add-modal.component.html',
  styleUrls: ['./yard-trade-pricing-add-modal.component.scss']
})
export class YardTradePricingAddModalComponent implements OnInit {


  isError: boolean = false;
  isServerError:boolean = false;

  units: Unit[] = [];

  yardTradePricing: YardTradePricing = new YardTradePricing();
  constructor(private orderService: OrderService,
    private modalService: ModalService,
    private yardTradePricingValidatorService: YardTradePricingValidatorService,
    private yardTradeStateService: YardtradeStateService) { }

  ngOnInit(): void {
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
    });
  }

  onSubmit() {
    this.isError = false;
    this.isServerError = false;
    if(!this.yardTradePricingValidatorService.isDataValid(this.yardTradePricing)) {
      this.isError = true;
      return;
    }

    // This is not a quote item
    this.yardTradePricing.quoteLineId = -1;
    this.yardTradePricing.quoteLine = {id: -1} as any;
    this.yardTradeStateService.$ItemAdded.next(JSON.parse(JSON.stringify(this.yardTradePricing)));
    this.cancel();
  }

  cancel() {
    this.yardTradePricing = new YardTradePricing();
    this.modalService.close('yardtradeAddItemModal');
  }
}
