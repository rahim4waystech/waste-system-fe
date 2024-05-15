import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/order/models/product.model';
import { OrderService } from 'src/app/order/services/order.service';
import { Unit } from 'src/app/order/models/unit.model';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  @Input()
  product: Product;

  units: Unit[] = [];
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits() {
    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Cannot load units");
      return e;
    }))
    .subscribe((data: Unit[]) => {
      this.units = data;
    })
  }

}
