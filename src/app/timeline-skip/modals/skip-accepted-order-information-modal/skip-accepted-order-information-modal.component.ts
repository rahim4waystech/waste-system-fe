import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/order/models/order.model';
import { OrderService } from 'src/app/order/services/order.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-skip-accepted-order-information-modal',
  templateUrl: './skip-accepted-order-information-modal.component.html',
  styleUrls: ['./skip-accepted-order-information-modal.component.scss']
})
export class SkipAcceptedOrderInformationModalComponent implements OnInit {

  @Input()
  order: Order;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  close() {
    this.modalService.close('orderInformationModal');
  }

}
