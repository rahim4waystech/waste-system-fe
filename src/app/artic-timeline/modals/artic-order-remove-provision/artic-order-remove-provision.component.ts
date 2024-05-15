import { Component, Input, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Order } from 'src/app/order/models/order.model';
import { OrderProvisionService } from 'src/app/order/services/order-provision.service';

@Component({
  selector: 'app-artic-order-remove-provision',
  templateUrl: './artic-order-remove-provision.component.html',
  styleUrls: ['./artic-order-remove-provision.component.scss']
})
export class ArticOrderRemoveProvisionComponent implements OnInit {

  @Input() 
  order: Order = new Order();

  @Input()
  date: string = '';
  
  constructor(private orderProvisionService: OrderProvisionService, 
    private modelService: ModalService) { }

  ngOnInit(): void {
  }

  save() {
    this.orderProvisionService.deleteSingleByOrderIdAndDate(this.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could delete provision');
      return e;
    }))
    .subscribe(() => {
      this.cancel();
    })
    
  }

  cancel() {
    this.modelService.close('ArticorderRemoveProvisionModal');
  }

}
