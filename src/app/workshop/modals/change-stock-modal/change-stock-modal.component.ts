import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Part } from '../../models/part.model';
import { PartService } from '../../services/part.service';
import { PartsStateService } from '../../services/parts-state.service';

@Component({
  selector: 'app-change-stock-modal',
  templateUrl: './change-stock-modal.component.html',
  styleUrls: ['./change-stock-modal.component.scss']
})
export class ChangeStockModalComponent implements OnInit {
  @Input()
  part:Part = new Part();

  newQty:number = 0;

  constructor(
    private modalService: ModalService,
    private partsStateService: PartsStateService,
    private partService: PartService
  ){}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.part){
      if(changes.part.currentValue.id !== -1){
      }
    }
  }

  save(){
    if(this.newQty > 0){
      this.part.qty += this.newQty;
      this.partService.updatePart(this.part)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Update Parts Quantity');return e;}))
      .pipe(take(1))
      .subscribe(() => {
       this.cancel();
      })
    } else {
      alert('New stock amount must be more than 0.')
    }


  }

  cancel() {
    this.reset();
    this.modalService.close('stockChangeModal');
  }

  reset() {
    this.partsStateService.$closedModal.next();
    this.part = new Part();
    this.newQty = 0;
  }

  validate(){
    let result = true;

    return result;
  }

}
