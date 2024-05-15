import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { catchError,take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { PriceListItem } from 'src/app/price-list/models/price-list-item.model';
import { PriceList } from 'src/app/price-list/models/price-list.model';
import { PriceListService } from 'src/app/price-list/services/price-list.service';
import { Account } from '../../models/account.model';
import { OrderLine } from '../../models/order-line.model';
import { Unit } from '../../models/unit.model';
import { OrderStateService } from '../../services/order-state.service';
import { OrderService } from '../../services/order.service';
import { OrderLineValidatorService } from '../../validators/order-line-validator.service';

@Component({
  selector: 'app-order-price-list-add-item',
  templateUrl: './order-price-list-add-item.component.html',
  styleUrls: ['./order-price-list-add-item.component.scss']
})
export class OrderPriceListAddItemComponent implements OnInit, OnChanges {

  isError: boolean = false;
  isServerError: boolean = false;

  @Input()
  account: Account = new Account();

  @Input()
  site: Account = new Account();

  priceLists: PriceList[] = [];

  orderLine: OrderLine = new OrderLine();

  priceListId: number = -1;
  units: Unit[] = [];

  items: PriceListItem[] = [];
  constructor(private priceListService: PriceListService,
    private modalService: ModalService,
    private orderLineValidatorService: OrderLineValidatorService,
    private orderStateService: OrderStateService,
    private orderService: OrderService) { }

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

  ngOnChanges(simple: SimpleChanges) {
    if(simple.account) {
      if(simple.account.currentValue.id !== -1) {
        this.priceListService.getActivePriceListsForAccount(this.account.id)
        .pipe(take(1))
        .pipe(catchError((e)=> {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not load price list');
          return e;
        }))
        .subscribe((lists: PriceList[]) => {
          this.priceLists = lists;
        })
      }
    }
  }

  onPriceListSelected($event) {
    this.priceListId = +$event.target.value;

    this.priceListService.getActiveItemsForPriceList(this.priceListId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load price list items');
      return e;
    }))
    .subscribe((items: PriceListItem[]) => {

      // Only items for all sites or this site.
      this.items = items.filter(i => i.siteId === -1 || i.siteId === this.site.id);
    });
  }

  onItemSelected($event) {

    const itemId = +$event.target.value;

    const item: PriceListItem = this.items.filter(i => i.id === itemId)[0];

    if(item) {
      this.orderLine.name = item.name;
      this.orderLine.unitId = item.unitId;
      this.orderLine.price = item.price;
    }
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
    this.modalService.close('orderPriceListAddItemModal');
  }

}
