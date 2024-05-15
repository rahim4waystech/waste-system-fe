import { Component, OnInit, Input } from '@angular/core';
import { Unit } from 'src/app/order/models/unit.model';
import { Grade } from 'src/app/container/models/grade.model';
import { TippingPrice } from '../../models/tipping-price.model';
import { AccountStateService } from '../../services/account-state.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { TippingPriceValidatorService } from '../../validators/tipping-price-validator.service';

@Component({
  selector: 'app-tipping-price-create-modal',
  templateUrl: './tipping-price-create-modal.component.html',
  styleUrls: ['./tipping-price-create-modal.component.scss']
})
export class TippingPriceCreateModalComponent implements OnInit {

  isError: boolean = false;
  isServerError: boolean = false;

  tippingPrice: TippingPrice = new TippingPrice();

  @Input()
  grades: Grade[] = [];

  @Input()
  units: Unit[] = [];
  constructor(private accountStateService: AccountStateService,
    private tippingPriceValidatorService: TippingPriceValidatorService,
    private modalService: ModalService) {
  }

  ngOnInit(): void {
  }

  save() {

    this.isError = false;

    if(!this.tippingPriceValidatorService.isValid(this.tippingPrice)) {
      this.isError = true;
      return;
    }

    this.accountStateService.$tippingPriceAdded.next(JSON.parse(JSON.stringify(this.tippingPrice)));
    this.close();
  }

  close() {
    this.tippingPrice = new TippingPrice();
    this.modalService.close('tippingPriceCreateModal')
  }

}
