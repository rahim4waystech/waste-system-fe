import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Part } from '../../models/part.model';
import { PartsStateService } from '../../services/parts-state.service';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  buttons: GridButton[] = [
    {label: 'View', type: 'btn-info', action: (button, record) => this.openModal('stockViewModal',record)} as GridButton,
    {label: 'Edit', type: 'btn-warning', action: (button, record) => this.openModal('stockEditModal',record)} as GridButton,
    {label: 'Stock Level', type: 'btn-success', action: (button, record) => this.openModal('stockChangeModal',record)} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: 'Product', field: 'name'} as GridColumn,
    {active: true, label: 'Category', field: 'partCategory.name', value: (v, r) => !r.partCategory ? 'N/A' : r.partCategory.name} as GridColumn,
    {active: true, label: 'Manufacturer', field: 'manufacturer'} as GridColumn,
    {active: true, label: 'Model', field: 'model'} as GridColumn,
    {active: true, label: 'Depot', field: 'depot.name', value: (v, r) => !r.depot ? 'N/A' : r.depot.name} as GridColumn,
    {active: true, label: 'In Stock', field: 'qty', value: v =>  v > 0 ? '<span class="badge badge-success">' + v + ' In Stock</span>': '<span class="badge badge-danger">No Stock</span>'} as GridColumn,
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['product','manufacturer','model','qty','sku','manufacturerPartNumber','eanNumber','value'];

  searchFilters: GridSearchFilter[] = [
    {field: 'product',label: 'Product'} as GridSearchFilter,
    {field: 'partCategory.name',label: 'Category'} as GridSearchFilter,
    {field: 'manufacturer',label: 'Manufacturer'} as GridSearchFilter,
    {field: 'model',label: 'Model'} as GridSearchFilter,
    {field: 'qty',label: 'Qty'} as GridSearchFilter,
    {field: 'sku',label: 'SKU'} as GridSearchFilter,
    {field: 'manufacturerPartNumber',label: 'Manufacturer Part No.'} as GridSearchFilter,
    {field: 'eanNumber',label: 'EAN Number'} as GridSearchFilter,
    {field: 'value',label: 'Value'} as GridSearchFilter,
  ]

  targetItem: Part = new Part();

  constructor(
    private modalService: ModalService,
    private partsStateService: PartsStateService
  ) { }

  ngOnInit(): void {
    this.partsStateService.$closedModal.subscribe(() => {
      this.gridComponent.getRecordsForEntity();
    });
  }

  openModal(modal:string,item:Part) {
    this.targetItem = item;
    this.modalService.open(modal);
  }

}
