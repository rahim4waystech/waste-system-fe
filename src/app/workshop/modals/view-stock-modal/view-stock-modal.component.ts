import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Part } from '../../models/part.model';
import { PartsStateService } from '../../services/parts-state.service';

@Component({
  selector: 'app-view-stock-modal',
  templateUrl: './view-stock-modal.component.html',
  styleUrls: ['./view-stock-modal.component.scss']
})
export class ViewStockModalComponent implements OnInit {
  @Input()
  part:Part = new Part();

  constructor(
    private modalService: ModalService,
    private partsStateService: PartsStateService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.item){
      if(changes.item.currentValue.id !== -1){
      }
    }
  }

  cancel() {
    this.modalService.close('stockViewModal');
  }
}
