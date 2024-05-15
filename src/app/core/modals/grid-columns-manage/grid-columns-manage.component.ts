import { Component, OnInit, Input } from '@angular/core';
import { GridColumn } from '../../models/grid-column.model';
import { GridStateService } from '../../services/grid-state.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-grid-columns-manage',
  templateUrl: './grid-columns-manage.component.html',
  styleUrls: ['./grid-columns-manage.component.scss']
})
export class GridColumnsManageComponent implements OnInit {

  @Input()
  gridColumns: GridColumn[] = [];
  constructor(private gridStateService: GridStateService,
    private modalService: ModalService) { }

  ngOnInit(): void {
  }

  save() {
    this.gridStateService.$gridColumnsUpdated.next(this.gridColumns);
    this.cancel();
  }

  cancel() {
    this.modalService.close("gridManageColumns");
  }

}
