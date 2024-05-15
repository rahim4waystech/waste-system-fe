import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Defect } from 'src/app/workshop/models/defect.model';
import { PartService } from 'src/app/workshop/services/part.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-assign-stock',
  templateUrl: './assign-stock.component.html',
  styleUrls: ['./assign-stock.component.scss']
})
export class AssignStockComponent implements OnInit {
  @Input()
  defect: Defect = new Defect();

  @Input()
  vehicle:Vehicle  = new Vehicle();

  @Input()
  allowLink:boolean = false;

  constructor(
    private modalService: ModalService,
    private partService: PartService
  ) { }

  ngOnInit(): void {
  }

  save(){

  }

  cancel() {
    this.reset();
    this.modalService.close('assignStockModal');
  }

  reset() {
    // this.partsStateService.$closedModal.next();
    // this.part = new Part();
    // this.newQty = 0;
  }
}
