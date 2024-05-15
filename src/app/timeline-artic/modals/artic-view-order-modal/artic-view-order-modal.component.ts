import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/order/models/order.model';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-artic-view-order-modal',
  templateUrl: './artic-view-order-modal.component.html',
  styleUrls: ['./artic-view-order-modal.component.scss']
})
export class ArticViewOrderModalComponent implements OnInit {

    @Input()
    order: Order;

    constructor(private modalService: ModalService) { }

    ngOnInit(): void {
    }

    close() {
      this.modalService.close('articOrderInformationModal');
    }
}
