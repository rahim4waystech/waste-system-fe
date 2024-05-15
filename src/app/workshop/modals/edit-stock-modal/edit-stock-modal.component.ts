import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Asset } from '../../models/asset.model';
import { Part } from '../../models/part.model';
import { AssetService } from '../../services/asset.service';
import { PartService } from '../../services/part.service';
import { PartsStateService } from '../../services/parts-state.service';

@Component({
  selector: 'app-edit-stock-modal',
  templateUrl: './edit-stock-modal.component.html',
  styleUrls: ['./edit-stock-modal.component.scss']
})
export class EditStockModalComponent implements OnInit {
  @Input()
  part:Part = new Part();

  asset: Asset = new Asset();

  constructor(
    private modalService: ModalService,
    private partsStateService: PartsStateService,
    private partService: PartService,
    private assetService:AssetService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.part){
      if(changes.part.currentValue.id !== -1){
      }
    }
  }

  save(){
    if(this.validate()){
      this.partService.updatePart(this.part)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Save Part');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.assetService.getAssetByPartId(this.part.id)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Save Part');return e;}))
        .pipe(take(1))
        .subscribe((asset:any) => {
          this.asset = asset[0];

          this.asset.asset = this.part.name;
          this.asset.make = this.part.manufacturer;
          this.asset.model = this.part.model;
          this.asset.description = this.part.description;
          this.asset.assetSerial = this.part.manufacturerPartNumber;
          this.asset.value = this.part.value
          this.asset.depotId = this.part.depotId;
          this.asset.depot.id = {id:this.part.depotId} as any;

          this.assetService.saveAsset(this.asset)
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Save Part');return e;}))
          .pipe(take(1))
          .subscribe( () => {
            this.cancel();
          })
        })
      })
    } else {
      alert('You need to fill in Name, Manufacturer and Quantity/Value cannot be a negative number.');
    }
  }

  cancel() {
    this.reset();
    this.modalService.close('stockEditModal');
  }

  reset() {
    this.partsStateService.$closedModal.next();
    this.part = new Part();
    this.asset = new Asset();
  }

  validate(){
    let result = true;

    if(this.part.name === ""){result = false;}
    if(this.part.manufacturer === ""){result = false;}
    if(this.part.qty < 0){result = false;}
    if(this.part.value < 0){result = false;}

    return result;
  }

}
