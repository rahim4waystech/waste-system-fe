import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Asset } from '../../models/asset.model';
import { Part } from '../../models/part.model';
import { AssetService } from '../../services/asset.service';
import { PartService } from '../../services/part.service';
import { PartsStateService } from '../../services/parts-state.service';

@Component({
  selector: 'app-add-stock-modal',
  templateUrl: './add-stock-modal.component.html',
  styleUrls: ['./add-stock-modal.component.scss']
})
export class AddStockModalComponent implements OnInit {
  @Input()
  part:Part = new Part();

  asset:Asset = new Asset();

  constructor(
    private modalService: ModalService,
    private partsStateService: PartsStateService,
    private partService: PartService,
    private assetService: AssetService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {}

  save(){
    if(this.validate()){
      this.assetService.getPartCategory()
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Part Category');return e;}))
      .pipe(take(1))
      .subscribe(data => {
        const partCategoryId = data[0].id

        this.partService.addPart(this.part)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Save Part');return e;}))
        .pipe(take(1))
        .subscribe((assetItem: any) => {
          this.asset.asset = this.part.name;
          this.asset.make = this.part.manufacturer;
          this.asset.model = this.part.model;
          this.asset.description = this.part.description;
          this.asset.assetSerial = this.part.manufacturerPartNumber;
          this.asset.value = this.part.value;
          this.asset.categoryId = partCategoryId;
          this.asset.category.id = partCategoryId;
          this.asset.entity = 'part';
          this.asset.active = true;
          this.asset.depotId = this.part.depotId;
          this.asset.depot.id = {id:this.part.depotId} as any;
          this.asset.partId = assetItem.id;
          this.asset.part = {id: assetItem.id} as any;



          this.assetService.createAsset(this.asset)
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
    this.modalService.close('stockAddModal');
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
    if(this.part.partCategoryId === -1){result=false;}

    return result;
  }

}
