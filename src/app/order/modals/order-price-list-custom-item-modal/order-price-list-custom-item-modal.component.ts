import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { OrderLine } from '../../models/order-line.model';
import { Unit } from '../../models/unit.model';
import { OrderStateService } from '../../services/order-state.service';
import { OrderService } from '../../services/order.service';
import { OrderLineValidatorService } from '../../validators/order-line-validator.service';

@Component({
  selector: 'app-order-price-list-custom-item-modal',
  templateUrl: './order-price-list-custom-item-modal.component.html',
  styleUrls: ['./order-price-list-custom-item-modal.component.scss']
})
export class OrderPriceListCustomItemModalComponent implements OnInit {

  isError: boolean = false;
  isServerError:boolean = false;

  units: Unit[] = [];

  orderLine: OrderLine = new OrderLine();
  constructor(private orderService: OrderService,
    private modalService: ModalService,
    private orderLineValidatorService: OrderLineValidatorService,
    private orderStateService: OrderStateService) { }

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
    if(!this.orderLineValidatorService.isDataValid(this.orderLine)) {
      this.isError = true;
      return;
    }

    // This is not a quote item
    this.orderLine.quoteLineId = -1;
    this.orderLine.quoteLine = {id: -1} as any;
    this.orderStateService.orderLineAdded$.next(JSON.parse(JSON.stringify(this.orderLine)));
    this.cancel();
  }

  cancel() {
    this.orderLine = new OrderLine();
    this.modalService.close('orderCustomItemModal');
  }

}
